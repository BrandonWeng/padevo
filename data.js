/**
 * Created by Brandon on 2017-03-25.
 */

// THIS FILE SHOULD BE RAN EVERY TIME THERE"S AN UPDATE

    // REQUIRE MODULES AND SET UP
var request = require('request');
var fs = require('fs');
var https = require('https');

var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.dbConfig());
var Monsters = require('./model/monstersModel')

// ----------------------------------------


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

// Get evolutions by making API HTTP GET request
function getEvolutions(NAmonsters) {
    request(url + 'api/evolutions/', function (err, res, body) {
        if (err) console.log("ERROR ", err);
        var response = JSON.parse(body);
       if (response) store(response,NAmonsters);
        console.log("Got evolutions")

    });
}


// Prases the two objects recieved from HTTP request and parse
// them into desired format (schema) then stored into DB
function store(evolutions,NAmonsters){

    function then_populate(){
        var fs = require('fs');

        var stream = fs.createWriteStream("list_of_monsters.js");

        stream.once('open',function(fd){
            stream.write("exports.arr=[ ")
            NAmonsters.forEach(function(monster){
                var m = {
                    name : monster.name,
                    id : monster.id.toString(),
                    materials : {}
                }

                function getMats(addToDB){
                    getMat(m.id,evolutions,m.materials)
                    addToDB(m)
                }

                stream.write("\"" + monster.id.toString() + " " + monster.name + "\"" + ",\n");

                getMats(addToDB)
            });

            stream.write("testing" + "];" + "\n");
            stream.end();
        })
    }

    function clearDB(callback){
        Monsters.remove({},callback);
    }

    clearDB(then_populate);

}

// Funciton used to store monster.jade into db
function addToDB(monster) {
    Monsters.create(monster, function (err, res) {
        if (err) console.log("ERROR " + err)
        else console.log(res)
    });
}

//
function getMat(id, evolutions, materials){

    // Iterate through every key and look for the path
    // that leads directly to ID
    Object.keys(evolutions).forEach(function (key) {
        var evos = evolutions[key];

        // Check each path of evolution
        evos.forEach(function(val){

            // NOTE:: 2978 is bugged ! dont store this (make sure to check this specifically later for front end)
            if (val != undefined && val.evolves_to == id && !allLits(val.materials)  && id != "2978") {

                // Check each material(s) and increment count
                val.materials.forEach(function (mat) {

                    var matID = mat[0];
                    var matCount = mat[1];

                    // If the material is not yet counted
                    if (materials[matID] == undefined) materials[matID] = matCount;
                    // Material was already counted, increase the count
                    else materials[matID] = materials[matID] + matCount;

                    // Recurse and calculate materials required for all children nodes
                    if (evolutions[matID] != undefined) getMat(matID,evolutions,materials);

                });

                // Check the if there's previous evolutions and add their material counts
                getMat(key,evolutions,materials)
            }
        });
    });
}

// used to check if the current set of materials is all lits (used to unevolve monster.jade)
// if so, return true, else return false.
// this is used to avoid counting the lits in the list of materials requried
function allLits(materials){

    // Compare each material to check if there is a path that leads to
    // the current node
    if (materials[1] == undefined ||
        materials[0] == undefined ||
        materials[2] == undefined ||
        materials[3] == undefined ||
        materials[4] == undefined) return false;

    // Return check if all the materials are all lits
    else return materials[0][0] == 155 && materials[1][0] == 156
        && materials[2][0] == 157 && materials[3][0] == 158 && materials[4][0] == 159 ;
}



/*
// used to download images of all evolution materials
var download = function(url, filename, callback){
    var path = "./public/images/";

    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(path+filename)).on('close', callback);
    });
};

// Function that download images - note only download 600 at a time to avoid images
// bugging (zero byte err)
function downloadImages() {
    request(url + 'api/monsters/', function (err, res, body) {
        if (err) console.log("ERROR ", err);
        var response = JSON.parse(body);

        response.forEach(function (monster.jade) {
            if (monster.jade && monster.jade.image40_href && monster.jade.id <= 3800 && monster.jade.id >= 3200) {
                download(url + monster.jade.image40_href, monster.jade.id + ".png", function (err, res) {
                    if (err) console.log(`ERROR downloading ${id}`)
                })
            }
        });

        console.log("downloaded!");
    });
}

//downloadImages()
*/

getUSmonsters(getEvolutions)
