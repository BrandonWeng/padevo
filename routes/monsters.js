var express = require('express');
var router = express.Router();
var Monsters = require('../model/monstersModel')

/* GETS MONSTER ID */
router.get('/:id',function(req,res,next){
    res.render('index', { title: req.params.id,me:"Testing" });
});

module.exports = router;
