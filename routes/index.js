var express = require('express');
var fortune = require('fortune');
var upcdata = require('../static/api/upcdata.json')
var router = express.Router();
var db = fortune({db: 'scoutnet'}).adapter;

function findById(source, id) {
  for (var i = 0; i < source.length; i++) {
    if(source[i].id == id) {
      return source[i];
    }
  }
  return null;
}

function findByUPC(source, id) {
  for (var i = 0; i < source.length; i++) {
    if(source[i].upc === id) {
      return source[i];
    }
  }
  return null;
}

/* GET home page. */
router.get('/', function(req, res) {
  db.findMany('list').then( function(lists) {
    db.findMany('product').then( function(products) {
      for(var i = 0; i < products.length; i++) {
        products[i].info = findByUPC(upcdata.data, products[i].barcode);
      }
      products.sort(function (a, b) {
        now = Date.now();
        dta = now - a.expires;
        dtb = now - b.expires;
        return (dta < dtb) ? 1 : ((dta > dtb) ? -1 : 0);
      })

      res.render('productlist', { title: 'Inventory', products:products, lists:lists });
    });
  });
});

router.get('/list/:id', function(req, res) {
  db.findMany('list').then( function(lists) {
    list = findById(lists, req.params.id);
    console.log(list.links.items)
    db.findMany('product', list.links.items).then( function(products) {
      console.log(products)
      for(var i = 0; i < products.length; i++) {
        products[i].info = findByUPC(upcdata.data, products[i].barcode);
      }
      products.sort(function (a, b) {
        now = Date.now();
        dta = now - a.expires;
        dtb = now - b.expires;
        return (dta < dtb) ? 1 : ((dta > dtb) ? -1 : 0);
      })
  
      res.render('productlist', { title: list.name, products:products, lists:lists });
    });
  });
});
module.exports = router;
