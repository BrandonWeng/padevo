var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.dbConfig());
var db = require('../model/monstersModel');
var list_of_monsters = require('../list_of_monsters').arr;

fromdb = '';
/* GETS MONSTER ID */
router.get('/:id/:grid',function(req,res,next){
  console.log('PARAMS', req.params)
  // var id = parseInt(req.query.search, 10);
  // console.log('the get request is here');
    id = req.params.id
    gridView = req.params.grid == 'true';
    db.findOne({id:id},function (err,docs){
        fromdb = docs;

        console.log('########' + fromdb);
        if (err || docs == null) res.render('error')
        else {
          // process the tree
          var test = {"evolves_from": {"evolves_from": {"materials": {}, "id": 2258}, "materials": {"1328": 2, "1463": {"evolves_from": {"materials": {}, "id": 1462}, "materials": {"251": 1, "250": 1, "150": 1, "174": 1, "249": 1}, "id": 1463}, "1176": 1, "1631": {"evolves_from": {"materials": {}, "id": 1630}, "materials": {"251": 1, "250": 1, "309": 1, "227": 1, "249": 1}, "id": 1631}}, "id": 2259}, "materials": {"1923": {"evolves_from": {"materials": {}, "id": 1922}, "materials": {"1328": 1, "1329": 1, "918": {"evolves_from": {"evolves_from": {"materials": {}, "id": 187}, "materials": {"234": 1, "251": 1, "160": 1, "227": 1, "321": 1}, "id": 188}, "materials": {"261": 2, "916": 3}, "id": 918}, "985": {"evolves_from": {"evolves_from": {"materials": {}, "id": 189}, "materials": {"151": 2, "178": 1, "175": 2}, "id": 190}, "materials": {"261": 2, "916": 3}, "id": 985}, "917": {"evolves_from": {"evolves_from": {"materials": {}, "id": 187}, "materials": {"234": 1, "251": 1, "160": 1, "227": 1, "321": 1}, "id": 188}, "materials": {"309": 2, "915": 3}, "id": 917}}, "id": 1923}, "2719": 1, "918": {"evolves_from": {"evolves_from": {"materials": {}, "id": 187}, "materials": {"234": 1, "251": 1, "160": 1, "227": 1, "321": 1}, "id": 188}, "materials": {"261": 2, "916": 3}, "id": 918}, "2528": {"evolves_from": {"materials": {}, "id": 2527}, "materials": {"1328": 2, "2127": {"evolves_from": {"evolves_from": {"evolves_from": {"materials": {}, "id": 84}, "materials": {"164": 2, "169": 2, "158": 1}, "id": 85}, "materials": {"321": 1, "174": 1, "160": 1, "150": 2}, "id": 319}, "materials": {"1274": {"evolves_from": {"evolves_from": {"evolves_from": {"materials": {}, "id": 82}, "materials": {"163": 2, "157": 1, "168": 2}, "id": 83}, "materials": {"149": 2, "160": 1, "173": 1, "321": 1}, "id": 318}, "materials": {"251": 1, "248": 1, "1176": 3}, "id": 1274}, "1273": {"evolves_from": {"evolves_from": {"evolves_from": {"materials": {}, "id": 80}, "materials": {"162": 2, "156": 1, "167": 2}, "id": 81}, "materials": {"172": 1, "160": 1, "148": 2, "321": 1}, "id": 317}, "materials": {"251": 1, "247": 1, "1176": 3}, "id": 1273}, "1176": 2, "1272": {"evolves_from": {"evolves_from": {"evolves_from": {"materials": {}, "id": 78}, "materials": {"155": 1, "166": 2, "161": 2}, "id": 79}, "materials": {"171": 1, "147": 2, "160": 1, "321": 1}, "id": 316}, "materials": {"251": 1, "1176": 3, "246": 1}, "id": 1272}}, "id": 2127}, "1206": {"evolves_from": {"materials": {}, "id": 285}, "materials": {"286": 1, "287": {"materials": {}, "id": 287}, "1176": 1, "284": 1, "283": 1}, "id": 1206}, "2128": {"evolves_from": {"evolves_from": {"evolves_from": {"materials": {}, "id": 86}, "materials": {"159": 1, "170": 2, "165": 2}, "id": 87}, "materials": {"175": 1, "160": 1, "151": 2, "321": 1}, "id": 320}, "materials": {"1274": {"evolves_from": {"evolves_from": {"evolves_from": {"materials": {}, "id": 82}, "materials": {"163": 2, "157": 1, "168": 2}, "id": 83}, "materials": {"149": 2, "160": 1, "173": 1, "321": 1}, "id": 318}, "materials": {"251": 1, "248": 1, "1176": 3}, "id": 1274}, "1273": {"evolves_from": {"evolves_from": {"evolves_from": {"materials": {}, "id": 80}, "materials": {"162": 2, "156": 1, "167": 2}, "id": 81}, "materials": {"172": 1, "160": 1, "148": 2, "321": 1}, "id": 317}, "materials": {"251": 1, "247": 1, "1176": 3}, "id": 1273}, "1176": 2, "1272": {"evolves_from": {"evolves_from": {"evolves_from": {"materials": {}, "id": 78}, "materials": {"155": 1, "166": 2, "161": 2}, "id": 79}, "materials": {"171": 1, "147": 2, "160": 1, "321": 1}, "id": 316}, "materials": {"251": 1, "1176": 3, "246": 1}, "id": 1272}}, "id": 2128}}, "id": 2528}, "917": {"evolves_from": {"evolves_from": {"materials": {}, "id": 187}, "materials": {"234": 1, "251": 1, "160": 1, "227": 1, "321": 1}, "id": 188}, "materials": {"309": 2, "915": 3}, "id": 917}}, "id": 3265};


          // REPLACE TEST WITH FROMDB
          var testRender = '<div class="evo_material">';
          if (gridView) {
            var monsterList = {};
            condensedMaterial(monsterList, test, true);
            console.log(monsterList);
            testRender += renderGrid(monsterList);
          }

          else {
            testRender += renderMaterial(test, 0) + '</div>';
            testRender += '<h4 class="material-count"></h4>';
          }


          res.render('monster', { title: docs.name, base:docs.id, monster:docs.materials, id:id, rendered:testRender, gridView:gridView})
        };
    });

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

////////////////////////////////////////////////////////////////////
// match monster by id (note array index not always == monster id)
////////////////////////////////////////////////////////////////////
var indexOfMonster = (id) => {
  // console.log('looking for', id);
  for (var i = 0 ; i < list_of_monsters.length ; i++) {
      if (list_of_monsters[i].indexOf(id) !== -1)
      return i;
  }
  return -1; // not found
}

// var condensedView = function();

var renderGrid = function(allMonsters) {
  total = 0;
  render = '';
  for (key in allMonsters) {
    render += '<span class="grid-item"><img data-toggle="tooltip" title="' + list_of_monsters[indexOfMonster(key)] + '" data-placement="right" class="parent-img" src="/images/' + key + '.png"/> x' + allMonsters[key] + '</span>';
    total += allMonsters[key];
  }
  render += '<h4>Required box space: ' + total + '</h4>';
  return render;
}

//
var condensedMaterial = function(allMonsters, monster, parent) {
  console.log('@@@@', monster['materials'])
  if (!parent && monster['evolves_from'] != undefined) {
    console.log('in here', monster['evolves_from'])
    if (monster['evolves_from']['evolves_from'] == undefined) {
      console.log('ENTRY', allMonsters[monster['evolves_from']['id']]);
      allMonsters[monster['evolves_from']['id']] = (allMonsters[monster['evolves_from']['id']] == undefined ? 1 : allMonsters[monster['evolves_from']['id']] + 1);

    }
    condensedMaterial(allMonsters, monster['evolves_from'], false);
  }
  for (i in monster['materials']) {
    var obj = monster['materials'][i];
    console.log('***', obj);
    if (obj['materials'] != undefined) {
      if (obj['evolves_from'] == undefined) {

        allMonsters[i] = (allMonsters[i] == undefined ? 1 : allMonsters[i] + 1);
        console.log('add', i, 1)
        // allMonsters[i]++;
      }
      condensedMaterial(allMonsters, obj, false);
    }
    else {
      allMonsters[i] = (allMonsters[i] == undefined ? obj : allMonsters[i] + obj);
      console.log('add', i, obj)
      // allMonsters[i] += obj;
    }
  }
}

// helper method to render
var renderMaterial = function(monster, level) {
  var render = '';
  if (level != 0 && monster['evolves_from'] != undefined) {
    // console.log('reached', monster['evolves_from']);
    render += '<div class="nested" data-num=1><img data-toggle="tooltip" title="' + list_of_monsters[indexOfMonster(monster['evolves_from']['id'])] + '" data-placement="right" class="parent-img" style="margin-bottom: 10px; margin-left: '+level*40+'px" src="/images/' + monster['evolves_from']['id'] + '.png"/> ' + ' x1 '+ (monster['evolves_from']['evolves_from'] != undefined ? '(evolved)' : '');
    render += renderMaterial(monster['evolves_from'], level + 1);
    render += '</div>'
  }

  for (i in monster['materials']) {
    var obj = monster['materials'][i];

    if (obj['materials'] != undefined) {
          render += '<div class="nested" data-num=1><img data-toggle="tooltip" title="' + list_of_monsters[indexOfMonster(i)] + '" data-placement="right" class="parent-img" style="margin-left: '+level*40+'px" src="/images/' + obj['id'] + '.png"/> ' + ' x1 ' + (obj['evolves_from'] != undefined ? '(evolved)' : '');
          render += renderMaterial(obj, level+1);
          render += '</div>';
    }
    else {
      render += '<div class="nested" data-num='+ obj +'><img data-toggle="tooltip" title="' + list_of_monsters[indexOfMonster(i)] + '" data-placement="right" style="margin-left: '+level*40+'px" src="/images/' + i + '.png"/> ' + ' x' + obj + '</div>';
    }
  }

  // old monster js
  // for (i in monster['materials']){
  //   var obj = monster['materials'][i];
  //
  //   if (obj['id'] !== undefined) {
  //     render += '<div class="nested"><img class="parent-img" style="margin-left: '+level*40+'px" src="/images/' + obj['id'] + '.png"/>' + obj['id'] + ' x1';
  //     render += renderMaterial(obj, level+1);
  //     render += '</div>';
  //   }
  //   else {
  //     render += '<div><img style="margin-left: '+level*40+'px" src="/images/' + i + '.png"/> x' + obj + '</div>';
  //   }
  // }
  // render += '<p> {{$(".nested").length}}</p>'
  return render;
}

module.exports = router;
