const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const {validationResult} = require('express-validator/check')

const Device = require('../models/device')
const User = require('../models/user')
const Data = require('../models/data')
const SettingDvData = require('../models/configDevice')
const Group = require('../models/iot')

exports.getCreateDevice = (req,res,next) => {
	
	res.render('admin/createdevice',{
		pageTitle:'Create Device',
		path:'/admin/station',
		editing:false,
		data:'',
		filterdata:[1],
		isAuthenticated:req.session.isLoggedIn,
		messerr:'',
		oldInput : {
			nameDevice:'',
			data1:'',
			unit1:'',
			location_lat:'',
			location_lng:'',
			description:'',
		}
	})
}

exports.getEditDevice = (req,res,next) => {
	const editing = req.query.edit;
	if(!editing) {
    	return res.redirect('/')
  	}
	const deviceId = req.params.deviceId
	Device.findById(deviceId)
		.then(data => {
			const arrkeyname = ['infoData1','infoData2','infoData3','infoData4','infoData5','infoData6','infoData7','infoData8','infoData9','infoData10']
			const filterdata1 = arrkeyname.map((item,index) => {
				if(data[arrkeyname[index]].namedata !== null || data[arrkeyname[index]].unit !== null ) {
					return data[arrkeyname[index]]
				}
			})
			const filterdata = filterdata1.filter(item => {
				return item !== undefined 
			})
			console.log(filterdata)
			// res.json(filterdata)
			return res.render('admin/createdevice',{
				pageTitle:'Create Device',
				path:'/admin/station',
				editing:editing,
				data:data,
				filterdata:filterdata,
				deviceId:deviceId,
				isAuthenticated:req.session.isLoggedIn,
				messerr:'',
				oldInput : {
					nameDevice:'',
					data1:'',
					unit1:'',
					location_lat:'',
					location_lng:'',
					description:'',
				}
			})
		})
		.catch(err => {
			console.log(err)
		})
}

exports.postCreateDevice = (req,res,next) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		return res.render('admin/createdevice',{
			pageTitle:'Create Device',
			path:'/admin/station',
			editing:false,
			data:'',
			filterdata:[1],
			isAuthenticated:req.session.isLoggedIn,
			messerr:errors.array()[0],
				oldInput : {
				nameDevice:req.body.nameDevice,
				data1:req.body.data1,
				unit1:req.body.unit1,
				location_lat:req.body.location_lat,
				location_lng:req.body.location_lng,
				description:req.body.description,
			}
		})
	}
	
    const device = new Device({
        nameDevice:req.body.nameDevice,
        infoData1:{namedata:req.body.data1 || null,unit:req.body.unit1 || null},
        infoData2:{namedata:req.body.data2 || null,unit:req.body.unit2 || null},
		infoData4:{namedata:req.body.data4 || null,unit:req.body.unit4 || null},
		infoData5:{namedata:req.body.data5 || null,unit:req.body.unit5 || null},
		infoData6:{namedata:req.body.data6 || null,unit:req.body.unit6 || null},
		infoData7:{namedata:req.body.data7 || null,unit:req.body.unit7 || null},
		infoData8:{namedata:req.body.data8 || null,unit:req.body.unit8 || null},
		infoData9:{namedata:req.body.data9 || null,unit:req.body.unit9 || null},
		infoData10:{namedata:req.body.data10 || null,unit:req.body.unit10 || null},
		infoData3:{namedata:req.body.data3 || null,unit:req.body.unit3 || null},
		location: {
			lat:req.body.location_lat,
			lng:req.body.location_lng
		},
		description:req.body.description,
        userId:req.user._id
    })
    device.save()
		.then(result => {
			const data = new Data({
				value:{
					data1:[],
					data2:[],
					data3:[],
					data4:[],
					data5:[],
					data6:[],
					data7:[],
					data8:[],
					data9:[],
					data10:[],
				},
				deviceId:result._id,
				userId:req.user._id
			})
			
			return data.save()
			.then(dt => {
				return result
				
			})
		})
		.then(result => {
			return req.user.saveDevice(result._id)
			.then(dt => {
				return result
			})
		
		})
		.then(result => {
			const configDevice = new SettingDvData({
				slepTime:'10000',
				status:'off',
				currentTime:'10 second',
				deviceId:result._id,
				userId:req.user._id,
			})
			
			configDevice.save()
			return result
		})
		.then(result => {
			// res.json(result._id)
			res.redirect(`/admin/infoDevice/${result._id}`)
		})
        .catch(err => {
            console.log(err)
        })
}


exports.postEditDevice = (req,res,next) => {
	const deviceId = req.params.deviceId
	const nameDevice = req.body.nameDevice
	const description =  req.body.description;
	const location =  {lat:req.body.location_lat,lng:req.body.location_lng}
	const infoData1 =  {namedata:req.body.data1 || null,unit:req.body.unit1 || null}
	const infoData2 =  {namedata:req.body.data2 || null,unit:req.body.unit2 || null}
	const infoData3 =  {namedata:req.body.data3 || null,unit:req.body.unit3 || null}
	const infoData4 =  {namedata:req.body.data4 || null,unit:req.body.unit4 || null}
	const infoData5 =  {namedata:req.body.data5 || null,unit:req.body.unit5 || null}
	const infoData6 =  {namedata:req.body.data6 || null,unit:req.body.unit6 || null}
	const infoData7 =  {namedata:req.body.data7 || null,unit:req.body.unit7 || null}
	const infoData8 =  {namedata:req.body.data8 || null,unit:req.body.unit8 || null}
	const infoData9 =  {namedata:req.body.data9 || null,unit:req.body.unit9 || null}
	const infoData10 =  {namedata:req.body.data10 || null,unit:req.body.unit10 || null}
	Device.findById(deviceId)
		.then(device => {
			device.nameDevice = nameDevice;
			device.infoData1 = infoData1;
			device.infoData2 = infoData2;
			device.infoData3 = infoData3;
			device.infoData4 = infoData4;
			device.infoData5 = infoData5;
			device.infoData6 = infoData6;
			device.infoData7 = infoData7;
			device.infoData8 = infoData8;
			device.infoData9 = infoData9;
			device.infoData10 = infoData10;
			device.location = location;
			device.description = description;
			return device.save()
			
			
		})
		.then(result => {
			res.redirect('/admin/station')
		})	
	
		.catch(err => {
			console.log(err)
		})
}


exports.postAutoData = (req,res,next) => {
	User.find()
	.then(result => {
		return result.find(item => {
			return item.listDevices.items.find(it => {
				return it.deviceId.toString() === req.body.deviceId
			})
		})
	})
	.then(result => {
		if(result) {
			Device.findOne({_id:req.body.deviceId})
			.then(result => {
				const arrKeyName = [
					'infoData1',
					'infoData2','infoData3','infoData4','infoData5',
					'infoData6','infoData7','infoData8','infoData9','infoData10'
				]
				const filterNameArr = arrKeyName.filter(item => {
					return result[item].namedata !== null;
				})

				// console.log(filterNameArr)
				let d = new Date();
				let initsenddt = {}
				const lastdt = filterNameArr.reduce((listsenddt,currentdt,index) => {
					listsenddt.time = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` || -1
					listsenddt[`data${index+1}`] = req.body[`data${index+1}`] || -1
					return listsenddt
				},initsenddt)
				console.log(lastdt)
				return lastdt
			})
			.then(result => {
				Data.findOne({deviceId:req.body.deviceId})
				.then(dt => {
					dt.updateData(result)
				})
			})
			.then(result => {
				return res.json(result)
			})
			.catch(err => {
				console.log(err)
			})
		} else {
			res.json('da xoa thiet bi')	
		}
	})
	
	// const indexhasDv = req.user.listDevices.items.findIndex(item => {
	// 	return item.deviceId.toString() === req.body.deviceId.toString();
	// })
	
	// if(indexhasDv >= 0) {
	// 	Device.findOne({_id:req.body.deviceId})
	// 	.then(result => {
	// 		const arrKeyName = [
	// 			'infoData1',
	// 			'infoData2','infoData3','infoData4','infoData5',
	// 			'infoData6','infoData7','infoData8','infoData9','infoData10'
	// 		]
	// 		const filterNameArr = arrKeyName.filter(item => {
	// 			return result[item].namedata !== null;
	// 		})
			
	// 		// console.log(filterNameArr)
	// 		let d = new Date();
	// 		let initsenddt = {}
	// 		const lastdt = filterNameArr.reduce((listsenddt,currentdt,index) => {
	// 			listsenddt.time = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` || -1
	// 			listsenddt[`data${index+1}`] = req.body[`data${index+1}`] || -1
	// 			return listsenddt
	// 		},initsenddt)
	// 		console.log(lastdt)
	// 		return lastdt
	// 	})
	// 	.then(result => {
	// 		Data.findOne({deviceId:req.body.deviceId})
	// 		.then(dt => {
	// 			dt.updateData(result)
	// 		})
	// 	})
	// 	.then(result => {
	// 		return res.json(result)
	// 	})
	// 	.catch(err => {
	// 		console.log(err)
	// 	})
	// } else {
	// 	res.json('da xoa thiet bi')	
	// }
}

exports.getSysParameter = (req,res,next) => {
    res.render('home/charts',{
        pageTitle:'Parameter',
        path:'/admin/sysParameter',
		isAuthenticated:req.session.isLoggedIn,
    })
}

exports.getStation = (req,res,next) => {
	req.user.populate({path:'listDevices.items.deviceId'})
	.then(result => {
		const dt = result.listDevices.items
		return dt.map(item => {
			return {
				nameDevice:item.deviceId.nameDevice,
				deviceId:item.deviceId._id,
				createAt:item.deviceId.createdAt,
				location:item.deviceId.location,
			}
		})
	})
	.then(result => {
		// res.json(result)
		req.user.configChart.filterChart = 0;
		return req.user.save()
		.then(dt => {
			return result
		})
		
	})
	.then(result => {
		res.render('admin/stationHome',{
			pageTitle:'Station',
			path:'/admin/station',
			data:result,
			isAuthenticated:req.session.isLoggedIn,
		})
	})
}

// download pdf in station 
exports.postDowlnoadSation = (req,res,next) => {
	const dt = req.body.dt
	const listIdDevice = dt.split('_');
	listIdDevice.pop();

	Device.find().where('_id').in(listIdDevice)
	.then(result => {
		
		const invoiceName = 'bao cao' + 'tong quan' + '.pdf'
		const pdfDoc = new PDFDocument();
		const PathFont = path.join('public','font','arial-unicode-ms.ttf')
		console.log(PathFont)
		res.setHeader('Content-Type','application/pdf')
		res.setHeader('Content-Disposition','inline;filename="' + invoiceName + '"')
		pdfDoc.pipe(res)
		pdfDoc.font(PathFont);
		result.forEach((item,index) => {
			pdfDoc.fontSize(18).text(`${index+1}. ${item.nameDevice}`,{
				underline :true
			})
			pdfDoc.fontSize(14).text(`Tên trạm:${item.nameDevice}`, {
				align: 'left'
			});
			pdfDoc.fontSize(14).text(`Mô tả:${item.description.toString()}`, {
				align: 'left'
			});
			pdfDoc.fontSize(14).text(`Vị trí: vĩ độ ${item.location.lat}, kinh độ ${item.location.lng}`, {
				align: 'left'
			});
			pdfDoc.moveDown();
		})
		pdfDoc.end()
	})

}


exports.getAnalysis = (req,res,next) => {
	const arrKeyName = [
		'infoData1',
		'infoData2','infoData3','infoData4','infoData5',
		'infoData6','infoData7','infoData8','infoData9','infoData10'
	]
	Device.find({userId:req.user._id})
	.then(result => {
		return result.map(item => {
			const lengthname = arrKeyName.filter(i => {
				return item[i].namedata !== null
			}).length
			return {userName:req.user.userName,nameDevice:item.nameDevice,numberFeil:lengthname,deviceId:item._id,createAt:item.createdAt}
		})
	})
	.then(result => {
		res.render('admin/analysisHome',{
				pageTitle:'Analysis',
				path:'/admin/analysis',
				data:result,
				isAuthenticated:req.session.isLoggedIn,
		})
	})
}

exports.getAnalysisId = (req,res,next) => {
	Data.findOne({deviceId:req.params.deviceId})
	.then(result => {
		const listname_dt = [
			'data1','data2','data3','data4','data5','data6','data7','data8','data9','data10'
		]
		const lastdt = listname_dt.filter(item => {
			return result.value[item].length > 0
		})
		const alldt = lastdt.map(item => {
			if(result.value[item].length >= 1000) {
				return result.value[item].slice(Math.max(result.value[item].length - 100, 1))
			} else {
				return  result.value[item]
			}
		})
		let alltime
		if(result.value.time.length >= 1000) {
			alltime = result.value.time.slice(Math.max(result.value.time.length - 100, 1))
		} else {
			alltime = result.value.time
		}
		return {alldt:alldt,alltime:alltime}
	})
	
	.then(result => {
		const arrKeyName = [
			'infoData1',
			'infoData2','infoData3','infoData4','infoData5',
			'infoData6','infoData7','infoData8','infoData9','infoData10'
		]
		Device.findOne({_id:req.params.deviceId})
		.then(dt => {
			const listn = arrKeyName.map(item => {
				if(dt[item].namedata !== null) {
					return dt[item].namedata
				}
			}).filter(item => item !== undefined)
			
			result.listn = listn;
			return result
		})
		.then(result => {
			// res.json(result)
			res.render('admin/analysis',{
				pageTitle:'Analysis',
				path:'/admin/analysis',
				data:result,
				isAuthenticated:req.session.isLoggedIn,
			})
		})
	})
}

// get setting controller
exports.getSetting = (req,res,next) => {
	const arrKeyName = [
		'infoData1',
		'infoData2','infoData3','infoData4','infoData5',
		'infoData6','infoData7','infoData8','infoData9','infoData10'
	]
	Device.find({userId:req.user._id})
	.then(result => {
		return result.map(item => {
			const lengthname = arrKeyName.filter(i => {
				return item[i].namedata !== null
			}).length
			return {userName:req.user.userName,nameDevice:item.nameDevice,numberFeil:lengthname,deviceId:item._id,createAt:item.createdAt}
		})
	})
	.then(result => {
		res.render('admin/setting',{
				pageTitle:'setting',
				path:'/admin/setting',
				data:result,
				isAuthenticated:req.session.isLoggedIn,
		})
	})
}

// get Setting one device id 
exports.getSettingId = (req,res,next) => {
	const deviceId = req.params.deviceId;
	SettingDvData.findOne({deviceId:deviceId})
	.then(result => {
		res.render('admin/settingId',{
			pageTitle:'setting',
			path:'/admin/setting',
			data:result,
			isAuthenticated:req.session.isLoggedIn,
		})
	})
	.catch(err => {
		console.log(err)
	})
}

// post setting device by id 
exports.postSettigId = (req,res,next) => {
	const deviceId = req.params.deviceId;
	const slepT = req.body.timeSend;
	const typeT = req.body.typeTime;
	const status = req.body.status;
	let slepTime = 10000;
	if(typeT === 'hour') {
		slepTime = slepTime*360*Number(slepT);
	} else if (typeT === 'second') {
		slepTime = slepTime/10*Number(slepT);
	} else if (typeT === 'minute') {
		slepTime = slepTime*6*Number(slepT);
	} else if (typeT === 'day') {
		slepTime = slepTime*360*24*Number(slepT);
	} else {
		slepTime = 10000;
	}
	
	SettingDvData.findOne({deviceId:deviceId})
	.then(result => {
		result.status = status;
		result.slepTime = slepTime.toString();
		result.currentTime = `${slepT} ${typeT}`
		return result.save()
	})
	.then(result => {
		res.redirect(`/admin/setting/${deviceId}`)
	})
	.catch(err => {
		console.log(err)
	})
}

exports.getSeeChart = (req,res,next) => {
	const listname_dt = [
		'data1','data2','data3','data4','data5','data6','data7','data8','data9','data10'
	]
	const indexchart = req.user.configChart.filterChart
	const text = "value." + listname_dt[indexchart].toString() || 0
	const option = {qty:1}
	option[text] = { $slice: - req.user.configChart.numberPoint }
	const option2 = {qty:1,'value.time':{ $slice: - req.user.configChart.numberPoint }}
	Data.findOne({deviceId:req.params.deviceId},option,).populate({path:'deviceId'})
	.then(result => {
		return Data.findOne({deviceId:req.params.deviceId},option2,).populate({path:'deviceId'})
		.then(dt => {
			const arrKeyName = [
				'infoData1',
				'infoData2','infoData3','infoData4','infoData5',
				'infoData6','infoData7','infoData8','infoData9','infoData10'
			]
			const filterNameArr = arrKeyName.filter(item => {
				return dt.deviceId[item].namedata !== null;
			})
			
			const data = {
				data:{
					values:result.value[listname_dt[indexchart]],
					time:dt.value.time,
				},
				name:dt.deviceId[filterNameArr[indexchart]].namedata,
				unit:dt.deviceId[filterNameArr[indexchart]].unit
			}
			
			return {
				data:data,listnamefilter:filterNameArr,
				infodt:dt.deviceId,listname_dt:listname_dt,
				documentKey:dt._id,deviceId:req.params.deviceId,
			}
		})
	})
	.then(result => {
		// res.json(result.data)
		res.render('admin/seechart',{
			pageTitle:'Chart',
			path:'/admin/station',
			data:result.data ,
			listnamefilter:result.listnamefilter,
			currentTypeChart:req.user.configChart.typeChart,
			currentNumberPoint:req.user.configChart.numberPoint,
			deviceId:req.params.deviceId,
			currentData:result.listname_dt[req.user.configChart.filterChart] || result.listname_dt[0],
			infodt:result.infodt,
			documentKey:result.documentKey,
			listname_dt:result.listname_dt,
			isAuthenticated:req.session.isLoggedIn,
			deviceId:result.deviceId,
		})
	})
	
}

// post download pdf seechart
exports.getDownloadSeechart = (req,res,next) => {
	const listname_dt = [
		'data1','data2','data3','data4','data5','data6','data7','data8','data9','data10'
	]
	const indexchart = req.user.configChart.filterChart
	const text = "value." + listname_dt[indexchart].toString() || 0
	const option = {qty:1}
	option[text] = { $slice: - req.user.configChart.numberPoint }
	const option2 = {qty:1,'value.time':{ $slice: - req.user.configChart.numberPoint }}
	Data.findOne({deviceId:req.params.deviceId},option,).populate({path:'deviceId'})
	.then(result => {
		return Data.findOne({deviceId:req.params.deviceId},option2,).populate({path:'deviceId'})
		.then(dt => {
			const arrKeyName = [
				'infoData1',
				'infoData2','infoData3','infoData4','infoData5',
				'infoData6','infoData7','infoData8','infoData9','infoData10'
			]
			const filterNameArr = arrKeyName.filter(item => {
				return dt.deviceId[item].namedata !== null;
			})
			
			const data = {
				data:{
					values:result.value[listname_dt[indexchart]],
					time:dt.value.time,
				},
				name:dt.deviceId[filterNameArr[indexchart]].namedata,
				unit:dt.deviceId[filterNameArr[indexchart]].unit
			}
			
			return {
				data:data,listnamefilter:filterNameArr,
				infodt:dt.deviceId,listname_dt:listname_dt,
				documentKey:dt._id,deviceId:req.params.deviceId,
			}
		})
	})
	.then(result => {
		const TextName = `data${result.deviceId}.txt`
		const PathText = path.join('data','text',TextName)
		let writer = fs.createWriteStream(PathText)
		let text_data = '';
		const data_txt = result.data.data.values.reduce((contai,current,index) => {
			return contai+current+ '\t\t\t' + result.data.data.time[index] + '\n' ;
		},text_data)
		writer.write(data_txt);
		const file = fs.createReadStream(PathText)
		res.setHeader('Content-Type','application/text')
		res.setHeader('Content-Disposition','inline;filename="' + TextName + '"')
		file.pipe(res)
	})	
}


exports.postfilterchart = (req,res,next) => {
	req.user.configChart.filterChart = req.body.filterChart;
	req.user.configChart.typeChart = req.body.typeChart;
	req.user.configChart.numberPoint = Number(req.body.numberPoint) ;
	req.user.save()
		.then(result => {
			return res.redirect(`/admin/seechart/${req.params.deviceId}`)
	})
		
		.catch(err => {
			console.log(err)
		})
}


// post delete device 

exports.deleteDevice = (req,res,next) => {
	const deviceId = req.params.deviceId;
	Device.deleteOne({_id:deviceId})
		
		.then(result => {
			return req.user.deleteDevice(deviceId)
		})
		
		.then(result => {
			return Data.deleteMany({
				deviceId:deviceId
			})
		})
		.then(result => {
			return SettingDvData.deleteOne({deviceId:deviceId})
		})	
	
		.then(result => {
			res.redirect('/admin/station')
		})
		
		.catch(err => {
			console.log(err)
		})
}


exports.getInfoDevice = (req,res,next) => {
	const deviceId = req.params.deviceId;
	req.user.populate({path:'listDevices.items.deviceId'})
	.then(result => {
		const dt = result.listDevices.items
		const filterdt = dt.find(item => {
			return item.deviceId._id.toString() === deviceId
		})
		const arrKeyName = [
			'infoData1',
			'infoData2','infoData3','infoData4','infoData5',
			'infoData6','infoData7','infoData8','infoData9','infoData10'
		]
		const filterNameArr = arrKeyName.filter(item => {
			return filterdt.deviceId[item].namedata !== null;
		})
		return {filterdt:filterdt,filterNameArr:filterNameArr} 
	})
	.then(result => {
		// res.json(result)
		res.render('admin/infodevice',{
			pageTitle:'Chart',
			path:'/admin/station',
			deviceId:deviceId,
			filterData:result.filterdt.deviceId,
			filterNameArr:result.filterNameArr,
			isAuthenticated:req.session.isLoggedIn,
		})
	})
}

// api get data device
exports.getDtDvApi = (req,res,next) => {
	// res.json(req.session.user._id)
	SettingDvData.find()
	.then(result => {
		const indexdt = result.findIndex(item => {
			return req.params.keyapi.toString() === `${item._id.toString()}${item.deviceId.toString()}${item.userId.toString()}`
		})
		
		if(indexdt >= 0) {
			return res.json({
				slepTime:result[indexdt].slepTime,
				status:result[indexdt].status
			})
		}
		
	})
	.catch(err => {
		console.log(err)
	})
}


// iot
// get groups iot
exports.getHomeIot = (req,res,next) => {
	Group.find({userId:req.user._id})
	.then(result => {
		res.render('iot/home',{
			pageTitle:'Iot',
			path:'/iot/home',
			data:result,
			isAuthenticated:req.session.isLoggedIn,
		})
	})
	.catch(err => {
		console.log(err)
	})
	
}

// post create group iot
exports.postCreateGr = (req,res,next) => {
	const name = req.body.name;
	const des = req.body.des;
	const imageUrl = req.body.imageUrl;
	
	const gr = new Group({
		name:name,
		description:des,
		imageUrl:imageUrl,
		elements:[],
		userId:req.user._id
	})
	gr.save()
	.then(result => {
		res.redirect('/admin/iot/home')
	})
}

// post delete group iot
exports.postDeleteGr = (req,res,next) => {
	Group.deleteOne({_id:req.params.groupId})
	.then(result => {
		res.redirect('/admin/iot/home')
	})
}

// get elements in iot
exports.getElements = (req,res,next) => {
	const groupId = req.params.groupId
	Group.findOne({_id:groupId})
	.then(result => {
		// res.json(result.elements)
		res.render('iot/elements',{
			pageTitle:'Iot',
			path:'/iot/home',
			data:result,
			isAuthenticated:req.session.isLoggedIn,
		})
	})
}

// post create element
exports.postCreateElement = (req,res,next) => {
	const objEle = {
		type:req.body.type_dv,
		name:req.body.name,
		des:req.body.des,
		status:"off",
		value:100,
		rotate:req.body.type_dv === "engine" ? 0 : 'null',
		groupId:req.params.EleId,
		id:req.params.EleId.toString()+ Math.random().toString() + Math.random().toString(),
	}
	Group.findOne({_id:objEle.groupId})
	.then(result => {
		return result.addElement(objEle)
		
	})
	.then(result => {
		res.redirect(`/admin/iot/home/elements/${req.params.EleId}`)
	})
}

// delete element in iot 
exports.postDeleteEle = (req,res,next) => {
	Group.findOne({_id:req.params.Grid})
	.then(result => {
		return result.deleteElement(req.query.eleid)
		
	})
	.then(result => {
		res.redirect(`/admin/iot/home/elements/${req.params.Grid}`)
		
	})
}

// get element in iot
exports.getElement = (req,res,next) => {
	Group.findOne({_id:req.params.GrId})
	.then(result => {
		return result.getElement(req.query.eleid)
	})
	.then(result => {
		const dt = {
			name:result.name,
			type:result.type,
			status:result.status,
			value:result.value,
			rotate:result.rotate,
		}
		// res.json(dt)
		res.render('iot/element',{
			pageTitle:'Iot',
			path:'/iot/home',
			data:result,
			isAuthenticated:req.session.isLoggedIn,
		})
	})	
}

exports.postSettingIotEle = (req,res,next) => {
	Group.findOne({_id:req.params.GrId})
	.then(result => {
		const dt = result.getElement(req.query.eleid);
		dt.value = req.body.value;
		dt.status = req.body.status;
		return result.updateElement(dt)
	})
	
	.then(result => {
		res.redirect(`/admin/iot/home/elements/see/${result.groupId}?eleid=${result.id}`)
	})
	
}