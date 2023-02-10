const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deviceSchema = new Schema({
    nameDevice: {
        type:String,
        // require:true
    },
	infoData1: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	infoData2: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	infoData3: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	infoData4: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	infoData5: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	infoData6: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	infoData7: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	infoData8: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	infoData9: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	infoData10: {
        namedata : {
			type:String
		},
		
		unit:{
			type:String
		}
    },
	
	description:{
		type:String,
	},
    
	location:{
		lat:{
			type:String
		},
		lng: {
			type:String
		}
	},

    userId : {
        type : Schema.Types.ObjectId,
        ref: 'User',
        // required: true
      },
	
	// values: {
	// 	items:[
	// 		{
	// 			dataId:{type: Schema.Types.ObjectId, ref: 'Data' , required: false },
	// 		}
	// 	]
	// } 

},{ timestamps: true })


module.exports = mongoose.model('Device',deviceSchema)