/**
 * Created by Brandon on 2017-03-27.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema

var monsterSchema = new Schema({
    id : String,
    monster : String,
    materials : Schema.Types.Mixed
});

var Monsters = mongoose.model('db',monsterSchema)

module.exports = Monsters;