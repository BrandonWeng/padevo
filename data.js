/**
 * Created by Brandon on 2017-03-25.
 */


var request = require('request');
var fs = require('fs');

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
        }
    });

    var materials = {};
    getAllMats('3266',evolutions,materials)

    console.log(materials)
    console.log("Stored")
}

function getAllMats(id,evolutions,materials) {

    // Check if this is the most basic stage
    // if so, end search
    if (evolutions[id] == undefined) {
        cantUnEvo(id,evolutions,materials)
        return;
    }

    var idEvoMat = evolutions[id][0].materials;
    var evoFrom = evolutions[id][0].evolves_to;

    // Check if there's no evolution available,
    // if not, end search
    if (idEvoMat == undefined) return;

    // If this is not the most basic evolution, recursively call
    // getAllMats on the previous stage of evolution
    if (canUnEvo(idEvoMat)) {

        getAllMats(evoFrom,evolutions,materials)

        // if there's more than one path, search for the one
        // that leads to the desired stage, then set IdEvoMat as that
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
    return materials[0][0] == 155 && materials[1][0] == 156 && materials[2][0] == 157
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
var download = function(uri, filename, callback){
    var path = "./public/images/";

    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(path+filename)).on('close', callback);
    });
};

/*
download( url + '/static/img/monsters/40x40/1087.86c7840800d0.png', 'google.png', function(){
    console.log('done');
});
*/

getUSmonsters(getEvolutions)