const express = require('express')
const router = express.Router()

const homeController = require('../controllers/home')

// get home
router.get('/',homeController.getIndex)

// get introduce
router.get('/introduce',homeController.getIntroduce)


module.exports = router