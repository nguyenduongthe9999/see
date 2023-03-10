const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://anhthe123bn:anhthe123bn@cluster0.udxywvc.mongodb.net/see?retryWrites=true&w=majority')
        .then(client => {
            console.log('connect succesfull!')
            _db = client.db()
            callback(client)
        })
        .catch(err => {
            console.log(err)
            throw err
        })
}

const getDb = () => {
    if (_db) {
        return _db
    }

    throw "No database found!"
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb