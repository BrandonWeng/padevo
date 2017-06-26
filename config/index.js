/**
 * Created by Brandon on 2017-03-27.
 */

var configValues = require('./config');

module.exports = {

    dbConfig : function(){
        "use strict";
        return 'mongodb://' + configValues.uname + ':' + configValues.pwd
            + '@ds143000.mlab.com:43000/evomats';
    }
}