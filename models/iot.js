const mongoose = require('mongoose')
const Schema = mongoose.Schema
const groupSchema = new Schema({
	name:{
		type:String,
	},
	description:{
		type:String,
	},
	imageUrl:{
		type:String,
	},
	elements:[],
	userId:{type: Schema.Types.ObjectId, ref: 'User' , required: true },
})

groupSchema.methods.getElement = function(id) {
	return this.elements.find(item => {
		return item.id.toString() === id.toString()
	})
}

groupSchema.methods.addElement = function(element) {
	this.elements.push(element);
	return this.save()
}

groupSchema.methods.deleteElement = function(id) {
	const indexelement = this.elements.findIndex(item => {
		return item.id.toString() === id
	}) 
	if(indexelement >= 0) {
		this.elements.splice(indexelement, 1)
	}
	return this.save()
}

groupSchema.methods.updateElement = function(element) {
	const indexelement = this.elements.findIndex(item => {
		return item.id === element.id
	})
	
	if(indexelement >= 0 ) {
		this.elements[indexelement] = element 
	}
	
	this.save()
	return this.elements[indexelement]
}

module.exports = mongoose.model('Group',groupSchema)