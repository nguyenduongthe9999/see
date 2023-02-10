const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataConfigDevice = new Schema({
    slepTime: {
        type:String,
    },
	
	status: {
		type:String,
	},
	
	currentTime:{
		type:String,
	},

    deviceId : {
        type : Schema.Types.ObjectId,
        ref: 'Device',
      },
	
	userId : {
        type : Schema.Types.ObjectId,
        ref: 'User',
      },

},)


module.exports = mongoose.model('SettingDvData',dataConfigDevice)