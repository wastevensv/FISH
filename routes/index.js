var express = require('express');
var fortune = require('fortune');
var router = express.Router();
var db = fortune({db: 'scoutnet'}).adapter;

/* GET home page. */
router.get('/', function(req, res) {
  db.findMany('product').then( function(list) {
      res.render('productlist', { title: 'FISH', products:list });
});
});

module.exports = router;
