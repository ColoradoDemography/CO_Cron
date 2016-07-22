/* Prepare FS Grants Data Pipeline (requires .pgpass installed, and google api key + instance permissions) */

var exec = require('child_process').exec;

//create geopts.json - for special districts map
module.exports.geopts = function(data_bucket) {
    var command = "node js/geopts.js";
    exec(command, {}, function(error, stdout, stderr) {
        console.log('--fs-grants--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        data_bucket.upload('geopts.json', function(err, file) {
            if (!err) {
                console.log('success uploading geopts.json');
            } else {
                console.log(err);
            }
        });
    });
}

//create grants.csv for CO_Grants Application
module.exports.fsgrants = function(data_bucket) {
    var command = "node js/grants.js"; //save to bucket inherent in this script
    exec(command, {}, function(error, stdout, stderr) {
        console.log('--csv-pts--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });
}