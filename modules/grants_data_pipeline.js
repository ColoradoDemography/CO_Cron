/* Prepare FS Grants Data Pipeline (requires .pgpass installed, and google api key + instance permissions) */

var exec = require('child_process').exec;

//create geopts.json 
module.exports.fsgrants = function(data_bucket) {
    var command = "php php/fs_shapes.php";
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

//create grantpts.csv for CO_Grants Application
module.exports.csvpts = function(data_bucket) {
    var command = "node js/csv.js"; //save to bucket inherent in this script
    exec(command, {}, function(error, stdout, stderr) {
        console.log('--csv-pts--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });
}