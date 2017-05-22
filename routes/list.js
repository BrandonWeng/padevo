var express = require('express');
var router = express.Router();

var list = require('../list_of_monsters.js')
/* GET home page. */
router.get('', function(req, res, next) {
  res.render('list',{data: list});
});

module.exports = router;
