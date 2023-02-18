const mongoose = require('mongoose')
const Schema = mongoose.Schema
const dataSchema = new Schema({
	value: {
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
		time:[],
	},
	deviceId:{type: Schema.Types.ObjectId, ref: 'Device' , required: true },
	userId:{type: Schema.Types.ObjectId, ref: 'User' , required: true },
})

dataSchema.methods.updateData = function(data) {
	
	const listdt = Object.keys(data).filter(item => {
		return data[item] !== null;
	})
	
	if(this.value[listdt[0]].length >= 10000000) {
		for(dt of listdt) {
			let newdata = this.value[dt];
			newdata.push(data[dt])
			newdata.shift()
			this.value[dt] = newdata
		}
		return this.save()
	} else {
		for(dt of listdt) {
			this.value[dt].push(data[dt])
		}
		
		return this.save()
	}
	
}


module.exports = mongoose.model('Data',dataSchema)