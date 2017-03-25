/**
 * Created by Brandon on 2017-03-25.
 */


var request = require('request');

var url = 'https://www.padherder.com/api/'

function monsters(evolutions) {
    request(url + 'monsters/', function (err, res, body) {
        if (err) console.log("ERROR ", err);
        var response = JSON.parse(body);

        response.forEach(function (monster) {
            if (!monster.jp_only) {
                console.log(monster.name + " " + monster.id);
            }
            ;
        })
    });
}

function evolutions() {
    request(url + 'evolutions/', function (err, res, body) {
        if (err) console.log("ERROR ", err);
        var response = JSON.parse(body);
        console.log(response['3003'][0])
    });
}



