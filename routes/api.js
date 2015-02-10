var fortune = require('fortune')
var upcdata = require('../static/api/upcdata.json')

function findById(source, id) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].upc === id) {
      return source[i];
    }
  }
}

var app = fortune({db: 'scoutnet'})
.resource('product', { // Product Object
	barcode: Number,
	expires: Date
}).transform( 
    function() { // Set expiration date on entry
        shelflife = findById(upcdata.data,this.barcode).life;
        timetolive = 1000 * 3600 * 24 * shelflife;
        this.expires = new Date(+new Date + timetolive);
        return this;
    }, 
    function() { // Add product info on reading
        this.info = findById(upcdata.data,this.barcode);
        delete this.barcode
        return this;
    }
) 

.resource('list', {
	name: String,
	type: Number,
	items: ['product']
})

module.exports = app.router
