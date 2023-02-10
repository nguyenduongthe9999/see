


// home page
exports.getIndex = (req,res,next) => {
    res.render('home/index',{
        pageTitle:'Home',
        path:'/',
		isAuthenticated:req.session.isLoggedIn,
    })
}

// infomation
exports.getIntroduce = (req,res,next) => {
    res.render('home/infoHome',{
        pageTitle:'Introduce',
        path:'/introduce',
		isAuthenticated:req.session.isLoggedIn,
    })
}

