var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.dbConfig());
var db = require('../model/monstersModel')

/* GETS MONSTER ID */
router.get('/:id',function(req,res,next){
    monster_id = req.params.id
    db.findOne({id:monster_id},function (err,docs){
        if (err) throw err;
        else res.render('monster.jade', { title: docs.name, monster:docs.materials,id:monster_id });
    });

});

router.post('/',function(req,res,next){
    var id = parseInt(req.body.monster_id);
    db.findOne({id:id},function(err,docs){
        console.log(docs,req.body,id)
        if (err) throw err;
        else res.render('monster',{title:docs.name,monster:docs.materials, id:id})
    });
});


module.exports = router;
