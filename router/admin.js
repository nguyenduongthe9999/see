const express = require('express')
const router = express.Router()
const {check,body} = require('express-validator/check')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

router.get('/createDevice',isAuth,adminController.getCreateDevice)

router.post('/CreateDevice',[
	body('nameDevice','Tên trạm phải có 4-30 kí tự.')
            .isLength({min:4,max:30})
            .trim(),
	body('data1','Tên dữ liệu phải có 2-24 kí tự.')
            .isLength({min:2,max:24})
            .trim(),
	body('unit1','Tên đơn vị phải có 1-24 kí tự.')
            .isLength({min:1,max:24})
            .trim(),
	body('location_lat','Cần nhập đúng định dạng vĩ độ.')
            // .isLatLong()
            .trim(),
	body('location_lng','Cần nhập đúng định dạng kinh độ.')
            // .isLatLong()
            .trim(),
	body('description','Mô tả phải có từ 10-1000 kí tự.')
            .isLength({min:10,max:1000})
            .trim(),
	
	
	
],isAuth,adminController.postCreateDevice)

// get sysParameter
router.get('/sysParameter',isAuth,adminController.getSysParameter)

// get station
router.get('/station',isAuth,adminController.getStation)

// get analysis
router.get('/analysis',isAuth,adminController.getAnalysis)

// get analysis-id
router.get('/analysis/:deviceId',isAuth,adminController.getAnalysisId)

// get setting
router.get('/setting',isAuth,adminController.getSetting)

// get setting device by ID 
router.get('/setting/:deviceId',isAuth,adminController.getSettingId)

// post setting device by ID
router.post('/setting/:deviceId',isAuth,adminController.postSettigId)

// get see chart
router.get('/seechart/:deviceId',isAuth,adminController.getSeeChart)

// post filter chart
router.post('/postfilterchart/:deviceId',isAuth,adminController.postfilterchart)

// post delete device
router.post('/deleteDevice/:deviceId',isAuth,adminController.deleteDevice)

// get edit device
router.get('/editDevice/:deviceId',isAuth,adminController.getEditDevice)

// post edit device
router.post('/editDevice/:deviceId',isAuth,adminController.postEditDevice)

// get info device 
router.get('/infoDevice/:deviceId',isAuth,adminController.getInfoDevice)

// post download pdf in station 
router.post('/station/download',isAuth,adminController.postDowlnoadSation)

// post download pdf in seechart 
router.get('/seechart/download/:deviceId',isAuth,adminController.getDownloadSeechart)




// iot
// get home groups iot
router.get('/iot/home',isAuth,adminController.getHomeIot)

// post create group
router.post('/iot/createGr',isAuth,adminController.postCreateGr)

// post delete groupiot
router.post('/iot/deleteGr/:groupId',isAuth,adminController.postDeleteGr)

// get elements in group
router.get('/iot/home/elements/:groupId',isAuth,adminController.getElements)

// post create element in iot
router.post('/iot/createElement/:EleId',isAuth,adminController.postCreateElement)

// post delete element in iot
router.post('/iot/deleteEle/:Grid',isAuth,adminController.postDeleteEle)

//  get element in iot
router.get('/iot/home/elements/see/:GrId',isAuth,adminController.getElement)

// post setting element in iot
router.post('/iot/home/elements/setting/:GrId',isAuth,adminController.postSettingIotEle)


// api
// api get 
router.get('/api/deviceData/:keyapi',adminController.getDtDvApi)

// api post data
router.post('/deployDt',adminController.postAutoData)


module.exports = router


