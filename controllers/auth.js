const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {validationResult} = require('express-validator/check')

const User = require('../models/user')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: 'thenguyenduong15@gmail.com',
        pass:'kbzlnqintvyexjzq'
    }
});

exports.getLogin = (req,res,next) => {
	res.render('auth/login',{
		pageTitle:'Login',
		path:'/login',
		errorMessage:'',
		oldInput: {
			email:'',
			password:'',
        },
		typeErr:''
	})
}

exports.postLogin = (req,res,next) => {
	const email = req.body.email;
	const password = req.body.password;
	
	User.findOne({email:email})
	.then(user => {
		if(!user) {
			return res.render('auth/login',{
				pageTitle:'Login',
				path:'/login',
				errorMessage:'Không tìm thấy email, vui lòng kiểm tra lại.',
				oldInput: {
					email:email,
					password:password,
				},
				typeErr:'email'
			})
		}
		bcrypt.compare(password,user.password)
		.then(doMatch => {
			if(doMatch) {
				req.session.isLoggedIn = true;
				req.session.user = user
				return req.session.save(err => {
					console.log(err)
					console.log('dang nhap thanh cong')
					res.redirect('/')
				})
			}
			
			res.render('auth/login',{
				pageTitle:'Login',
				path:'/login',
				errorMessage:'Sai email hoặc mật khẩu.',
				oldInput: {
					email:email,
					password:password,
				},
				typeErr:'password'
			})
		})
		.catch(err => {
			console.log(err)
			res.redirect('/login')
		})
		
	})
	.catch(err => {
		console.log(err)
	})
}

exports.postLogout = (req,res,next) => {
	req.session.destroy(err => {
		console.log(err)
		res.redirect('/')
	})
}

exports.getSignUp = (req,res,next) => {
	res.render('auth/signup',{
		pageTitle:'Sign up',
		path:'/Signup',
		errorMessage:'',
		oldInput: {
			userName:'',
			email:'',
			password:'',
			repassword:''
        },
	})
}

exports.postSignup = (req,res,next) => {
	const email = req.body.email;
	const password = req.body.password;
	const userName = req.body.userName;
	const repassword = req.body.repassword;
	
	const errors = validationResult(req)
	if(!errors.isEmpty()) {
        return res.render('auth/signup',{
			pageTitle:'Sign up',
			path:'/Signup',
			oldInput: {
				userName:userName,
				email:email,
				password:password,
				repassword:repassword,
			},
			errorMessage:errors.array()[0],
		})
    }
	User.findOne({email:email})
		.then(result => {
			if(result) {
				console.log('da ton tai email')
				return res.redirect('/signup')
			}
			return bcrypt
				.hash(password,10)
				.then(hashedpass => {
					const user = new User({
						email:email,
						password:hashedpass,
						userName:userName,
						configChart:{
							filterChart:0,
							typeChart:'line',
							numberPoint:60,
						},
						listDevices:{
							items:[]
						}
					})
					return user.save()
				})
				.then(result => {
					return transporter.sendMail({
						to: email,
						from: 'thenguyenduong15@gmail.com',
						subject:'Signup succeeded',
						html:'<h1>You successfully Sign up!</h1>'
					});
				})
				.then(result => {
					res.redirect('/login')
				})
		})
		.catch(err => {
			console.log(err)
		})
}

// get reset password 
exports.getReset = (req,res,next) => {
	res.render('auth/reset',{
		pageTitle:'Reset password',
		path:'/auth/resetPassword',
		errorMessage:'',
		oldInput: {
			email:'',
		},
	})
}

// post resetPassword 
exports.postReset = (req,res,next) => {
	crypto.randomBytes(32,(err,buffer) => {
		if(err) {
			console.log(err)
			return res.redirect('/reset')
		}
		
		const email = req.body.email
		const token = buffer.toString('hex')
		
		User.findOne({email:email})
		.then(user => {
			if(!user) {
				return res.render('auth/reset',{
					pageTitle:'Reset password',
					path:'/auth/resetPassword',
					errorMessage:'Không tìm thấy email, vui lòng kiểm tra lại.',
					oldInput: {
						email:email,
					},
				})
			}
			user.resetToken = token;
			user.resetTokenExpiration = Date.now() + 3600000;
			return user.save()
			.then(result => {
				transporter.sendMail({
					to: email,
					from: 'thenguyenduong15@gmail.com',
					subject:'Password reset',
					html:`
						<p>You requested a passowrd reset</p>
						<p>Click this <a href="https://seed-data.run.goorm.app/reset/${token}">link</a> to set a new password.</p>

					`
				},function(err,res) {
					if(err) {
						console.log(err)
					}
					console.log(res)
				});
				res.redirect('/notiReset')

			})
			
		})
		
		.catch(err => {
			console.log(err)
		})
		
	})
	
}

// get notiReset pass
exports.getnotiReset = (req,res,next) => {
	res.render('auth/notiReset',{
		pageTitle:'Noti Reset password',
		path:'/auth/notiReset',
	})
}

// get new password 
exports.getNewPass = (req,res,next) => {
	const token = req.params.token
	User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
	.then(user => {
		res.render('auth/newPassword',{
			pageTitle: 'New Password',
			path: '/auth/new-password',
			userId:user._id.toString(),
			passwordToken:token,
			oldInput: {
				password:'',
				repassword:'',
			},
			errorMessage:'',
		})
	})
	.catch(err => {
		console.log(err)
	})
}

// post new password
exports.postNewPassword = (req,res,next) => {
	const newPassword = req.body.password;
    const passwordToken = req.body.passwordToken
	const rePassword = req.body.rePassword;
	const errors = validationResult(req)
	if(!errors.isEmpty()) {
        return res.render('auth/newPassword',{
			pageTitle: 'New Password',
			path: '/auth/new-password',
			userId:req.body.userId,
			passwordToken:passwordToken,
			oldInput: {
				password:newPassword,
				repassword:rePassword,
			},
			errorMessage:errors.array()[0],
		})
    }
	User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()},_id:req.body.userId})
	.then(user => {
		return bcrypt
		.hash(newPassword,10)
		.then(hashedPassword => {
			user.password = hashedPassword;
			user.resetToken = undefined;
			user.resetTokenExpiration = undefined;
			return user.save()
		})
	})
	.then(result => {
		res.redirect('/login')
	})
	.catch(err => {
		console.log(err)
	})
}