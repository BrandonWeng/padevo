var express = require('express');
var router = express.Router();
var _ = require('lodash');

var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.dbConfig());
var db = require('../model/monstersModel');

router.get('/list', (req, res, next) => {
  console.log('request params: ', req.query);
  var query = db.find({'name' : new RegExp(req.query.q, "i")}).select({ 'id' : 1 , 'name' : 1 , '_id' : 0 }).sort({ 'id' : 1 }).skip(req.query.page * 10).limit(20);
  query.exec((err, data) => {
    var rc = _.map(data, function (obj, i) {
      return {
          id: parseInt(obj.id),
          text: obj.id + ' ' + obj.name
      };
    });
    console.log(rc);
    res.send(rc);
  })
  // db.find({}, (err, data) => {
  //   console.log(data.map(item => {
  //     return item.name;
  //   }));
  // })
});


module.exports = router;
