/**
 * Created by Brandon on 2017-03-25.
 */


var request = require('request');
var fs = require('fs');

var url = 'https://www.padherder.com/'

function getUSmonsters(evolutions) {
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
        store(response,NAmonsters);
        console.log("Got evolutions")
    });


}

function store(evolutions,NAmonsters){

}


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