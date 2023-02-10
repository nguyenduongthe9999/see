const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const MONGODB_URI = 'mongodb+srv://anhthe123bn:anhthe123bn@cluster0.udxywvc.mongodb.net/see?retryWrites=true&w=majority'

const app = express()
const store = new MongoDBStore({
	uri: MONGODB_URI,
  	collection: 'sessions'
})

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const User = require('./models/user')
const homeRouter = require('./router/home')
const adminRouter = require('./router/admin')
const authRouter = require('./router/auth')
const Data = require('./models/data')

// set views template engine 
app.set('view engine', 'ejs');
app.set('views', 'views');

mongoose.set("strictQuery", false);

// dinh dang du lieu o phan req.body
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


// static file
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'node_modules')))

app.use(session({
	secret:'firts project',
	resave: false,
	saveUninitialized: false,
	store:store,
}))

app.use((req,res,next) => {
	if(!req.session.user) {
		return next()
	}
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => {
            console.log(err)
        })
})

app.use((req,res,next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn
	next();
})

app.use(homeRouter)
app.use('/admin',adminRouter)
app.use(authRouter)


// socket io
const dataEventEmitter = Data.watch()
io.on('connection', (socket) => {
	dataEventEmitter.on('change', async (change) => {
		if(change.updateDescription) {
			await socket.emit('chat message',change,change.updateDescription.updatedFields);
		}
	})
});


mongoose.connect(MONGODB_URI)
.then(result => {
    console.log('connect successfull!')
    server.listen(3000)
}).catch(err => {
    console.log(err)
})
