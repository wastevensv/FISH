var fortune = require('fortune')
var upcdata = require('../static/api/upcdata.json')

function findById(source, id) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].upc == id) {
      return source[i];
    }
  }
  //return source[0];
}

var app = fortune({db: 'FISH'})
app.resource('product', { // Product Object
	barcode: Number,
	expires: Date
}).transform(
    function() { // Set expiration date on entry
        console.log(this.barcode, typeof this.barcode);
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

app.resource('list', {
	name: String,
	type: Number,
	items: ['product']
}).transform(
    function(req, res) {
        if(req.params.id !== 'undefined') {
          update = this
          app.adapter.find('list',req.params.id).then(function(orig) {
            if (typeof(update.items) !== 'undefined') {
              update.items.push.apply(update.items, orig.links.items)
              return orig
            }
          })
        }
        return this
    },
    function() {
      return this
    }
)

module.exports = app.router
