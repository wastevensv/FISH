var fortune = require('fortune')
var app = fortune({db: 'scoutnet'})
	.resource('product', {
		barcode: Number,
		prodname: String,
		expires: Date
	}).resource('list', {
		name: String,
		type: Number,
		items: ['product']
	})

module.exports = app.router
