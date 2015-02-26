var express = require('express');
var fortune = require('fortune');
var upcdata = require('../static/api/upcdata.json')
var router = express.Router();
var db = fortune({db: 'scoutnet'}).adapter;

function findById(source, id) {
  for (var i = 0; i < source.length; i++) {
    if(source[i].upc === id) {
      return source[i];
    }
  }
  return null;
}


/* GET home page. */
router.get('/', function(req, res) {
  db.findMany('product').then( function(list) {
    for(var i = 0; i < list.length; i++) {
      list[i].info = findById(upcdata.data, list[i].barcode);
    }
    list.sort(function (a, b) {
      now = Date.now();
      dta = now - a.expires;
      dtb = now - b.expires;
      return (dta < dtb) ? 1 : ((dta > dtb) ? -1 : 0);
    })

    res.render('productlist', { title: 'Inventory', products:list });
  });
});

module.exports = router;
