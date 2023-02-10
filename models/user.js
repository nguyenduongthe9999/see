const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type:String,
        require:true
    },
    password: {
        type:String,
        require:true
    },

    userName: {
        type:String,
        require:true
    },
	
	resetToken: String,
    resetTokenExpiration: Date,
	
	configChart: {
		filterChart: {
			type:Number
		},
		
		typeChart: {
			type:String
		},
		
		numberPoint : {
			type:Number
		}
		
	},
	

    listDevices : {
        items: [
            {
                deviceId:{type: Schema.Types.ObjectId, ref: 'Device' , required: true },
            }
        ]
    }

})

userSchema.methods.saveDevice = function(deviceId) {
	const indexDevice = this.listDevices.items.findIndex(cp => {
		return cp.deviceId.toString() === deviceId.toString()
	})
	
	const updateData = [...this.listDevices.items]
	if(indexDevice >= 0) {
		console.log('da ton tai')
				
	}	else {
		updateData.push({deviceId:deviceId})
	}
	
	const updatelistDevices = {items:updateData}
	this.listDevices = updatelistDevices
	return this.save()
}


userSchema.methods.deleteDevice = function(deviceId) {
	const indexDeleDevice = this.listDevices.items.findIndex(cp => {
		return cp.deviceId.toString() === deviceId.toString()
	})
	
	if(indexDeleDevice >= 0) {
		this.listDevices.items.splice(indexDeleDevice,1)
		console.log('da xoa khoi user')
		return this.save()
	}
	
	// return this.save()
}

module.exports = mongoose.model('User',userSchema)