var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.dbConfig());
var db = require('../model/monstersModel')

/* GETS MONSTER ID */
router.get('/:id',function(req,res,next){
    db.findOne({id:req.params.id},function (err,docs){
        if (err) throw err;
        else console.log(docs);
        res.render('monster.jade', { title: docs.name, monster:docs.materials });
    }
    );

});

module.exports = router;
