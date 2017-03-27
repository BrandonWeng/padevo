/**
 * Created by Brandon on 2017-03-25.
 */


var request = require('request');
var fs = require('fs');
var https = require('https');

var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.dbConfig());
var Monsters = require('./model/monstersModel')

var url = 'https://www.padherder.com/'

// Make's an GET request to url and get a lit of monsters
function getUSmonsters(getEvolutions) {
    request(url + 'api/monsters/', function (err, res, body) {
        if (err) console.log("ERROR ", err);
        var response = JSON.parse(body);

        var NAmonsters = [];

        response.forEach(function (monster) {
            if (!monster.jp_only) {
                NAmonsters.push(monster);
            };
        })

        if (NAmonsters) getEvolutions(NAmonsters);
        else console.log("ERROR no monsters found!")
    });
}

function getEvolutions(NAmonsters) {
    request(url + 'api/evolutions/', function (err, res, body) {
        if (err) console.log("ERROR ", err);
        var response = JSON.parse(body);
       if (response) store(response,NAmonsters);
        console.log("Got evolutions")
    });
}

function store(evolutions,NAmonsters){

    NAmonsters.forEach(function(monster){
        var m = {
            name : monster.name,
            id : monster.id.toString(),
            materials : {}
        }
        function getMats(addToDB){
            getAllMats(m.id,evolutions,m.materials)
            addToDB(m)
        }

        getMats(addToDB)
    });

    console.log("Stored");
}

function addToDB(monster) {
    Monsters.create(monster, function (err, res) {
        if (err) console.log("ERROR " + err)
        else console.log(res)
    });
}

function getAllMats(id,evolutions,materials) {

    // Check if this is the most basic stage
    // if so, end search
    if (evolutions[id] == undefined || evolutions[id][0] == undefined) {
        cantUnEvo(id,evolutions,materials)
        return;
    }

    var idEvoMat = evolutions[id][0].materials;
    var evoFrom = evolutions[id][0].evolves_to;

    // Check if there's no evolution available,
    // if not, end search
    if (idEvoMat== undefined) return;

    // If this is not the most basic evolution, recursively call
    // getAllMats on the previous stage of evolution
    if (canUnEvo(idEvoMat)) {

        getAllMats(evoFrom,evolutions,materials)

        // if there's more than one path, search for the one
        // that leads to the desired stage, then set IdEvoMat as that

        if (evolutions[evoFrom] == undefined) return;
        evolutions[evoFrom].forEach(function(mat){
            if (mat.evolves_to == id){
                idEvoMat = mat.materials
            }
        });

        // Look for the materials required for the current level to
        // reach the desired level
        idEvoMat.forEach(function (mat) {
            if (materials[mat[0]] == undefined) materials[mat[0]] = mat[1];
            else materials[mat[0]] = materials[mat[0]] + mat[1];
            getAllMats(mat[0], evolutions, materials)
        });

    } else {
        if (materials[id] == undefined) materials[id] = 1;
        else materials[id] = materials[id] + 1;
    }

}

function canUnEvo(materials){
    // Compare each material to check if there is a path that leads to
    // the current node
    if (materials[1] == undefined
        || materials[0] == undefined
        || materials[2] == undefined
        || materials[3] == undefined
        || materials[4] == undefined) return false;

    else return materials[0][0] == 155 && materials[1][0] == 156 && materials[2][0] == 157
        materials[3][0] == 158 && materials[4][0] == 159 ;
}

function cantUnEvo(id,evolutions,materials){

    Object.keys(evolutions).forEach(function (key) {
        var val = evolutions[key][0];

        if (val != undefined && val.evolves_to == id) {
            val.materials.forEach(function (mat) {
                if (materials[mat[0]] == undefined) materials[mat[0]] = mat[1];
                else materials[mat[0]] = materials[mat[0]] + mat[1];
            });
        }

    });
}

// used to download images of all evolution materials
var download = function(url, filename, callback){
    var path = "./public/images/";

    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(path+filename)).on('close', callback);
    });
};

function downloadImages() {
    request(url + 'api/monsters/', function (err, res, body) {
        if (err) console.log("ERROR ", err);
        var response = JSON.parse(body);

        response.forEach(function (monster) {
            if (monster && monster.image40_href) {
                download(url + monster.image40_href, monster.id + ".png", function (err, res) {
                    if (err) console.log(`ERROR downloading ${id}`)
                });
            }
        });

        console.log("downloaded!");
    });
}

/*
download( url + '/static/img/monsters/40x40/1087.86c7840800d0.png', 'google.png', function(){
    console.log('done');
});
*/

//getUSmonsters(getEvolutions)
downloadImages()