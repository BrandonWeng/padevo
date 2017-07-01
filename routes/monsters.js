var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.dbConfig());
var db = require('../model/monstersModel')

fromdb = '';
/* GETS MONSTER ID */
router.get('/:id',function(req,res,next){
  console.log(req.params)
  // var id = parseInt(req.query.search, 10);
  console.log('the get request is here');
    id = req.params.id
    db.findOne({id:id},function (err,docs){
        fromdb = docs;
        if (err || docs == null) res.render('error')
        else res.render('monster', { title: docs.name, base:docs.id, monster:docs.materials,id:id });
    });
    console.log(fromdb);

});

router.post('/',function(req,res,next){
    console.log("// CALLED")
    var id = parseInt(req.body.monster_id);
    db.findOne({id:id},function(err,docs){
        console.log(docs,req.body,id)
        if (err) throw err;
        else res.render('monster',{title:docs.name,monster:docs.materials, id:id})
    });
});


module.exports = router;
