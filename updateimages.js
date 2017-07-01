/**
 * Created by Brandon on 2017-06-30.
 */
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

        response.forEach(function (monster) {
            if (monster && monster.image40_href && monster.id <= 3800 && monster.id >= 3200) {
                download(url + monster.image40_href, monster.id + ".png", function (err, res) {
                    if (err) console.log(`ERROR downloading ${id}`)
                })
            }
        });

        console.log("downloaded!");
    });
}

downloadImages()