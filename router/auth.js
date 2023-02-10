const express = require('express')
const router = express.Router()
const {check,body} = require('express-validator/check')
const User = require('../models/user')


const authController = require('../controllers/auth')

// get sign in 
router.get('/login',authController.getLogin)

// post login
router.post('/login',authController.postLogin)

// get sign up
router.get('/signup',authController.getSignUp)

// post logout
router.post('/logout',authController.postLogout)

// post sign up
router.post('/signup',[
	body('userName','Họ tên phải có 4-30 kí tự')
            .isLength({min:4,max:30})
            .trim(),
	check('email')
		.isEmail()
		.withMessage('Bạn cần nhập đúng email')
		.custom((value,{req}) => {
			return User.findOne({email:value})
				.then(result => {
					if(result) {
						return Promise.reject('Email đã tồn tại')
					}
					return true
				})
		})
		.normalizeEmail(),

	body('password','Mật khẩu phải có ít nhất 8 kí tự và không có kí tự đặc biệt')
		.isLength({min:8})
		.isAlphanumeric()
		.trim(),
	body('repassword').custom((value,{req}) => {
		if(value !== req.body.password) {
			throw new Error('Mật khẩu nhập lại không chính xác')
		}

		return true
	})
],authController.postSignup)

// get reset pass 
router.get('/reset',authController.getReset)

// post reset pass 
router.post('/reset',authController.postReset)

// get notiReset pass 
router.get('/notiReset',authController.getnotiReset)

// get new password 
router.get('/reset/:token',authController.getNewPass)

// post new password
router.post('/newPassword',[
	body('password','Mật khẩu phải có ít nhất 8 kí tự và không có kí tự đặc biệt')
		.isLength({min:8})
		.isAlphanumeric()
		.trim(),
	body('rePassword').custom((value,{req}) => {
		if(value !== req.body.password) {
			throw new Error('Mật khẩu nhập lại không chính xác')
		}

		return true
	})
],authController.postNewPassword)

module.exports = router