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

module.exports.competitive = function(bls_bucket) {
    var command = "php https://storage.cloud.google.com/bls-data/get_competitive.php";
    exec(command, {}, function(error, stdout, stderr) {
        console.log('--fs-grants--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        data_bucket.upload('competivitive2.json', function(err, file) {
            if (!err) {
                console.log('success uploading competitive2.json');
            } else {
                console.log(err);
            }
        });
    });
}

module.exports.allcompetitive = function(bls_bucket) {
    var command = "php https://storage.cloud.google.com/bls-data/get_competitive_all.php";
    exec(command, {}, function(error, stdout, stderr) {
        console.log('--fs-grants--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        data_bucket.upload('allcompetivitive.json', function(err, file) {
            if (!err) {
                console.log('success uploading allcompetitive.json');
            } else {
                console.log(err);
            }
        });
    });
}

module.exports.formulaic = function(bls_bucket) {
    var command = "php https://storage.cloud.google.com/bls-data/get_formulaic.php";
    exec(command, {}, function(error, stdout, stderr) {
        console.log('--fs-grants--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        data_bucket.upload('formulaic.json', function(err, file) {
            if (!err) {
                console.log('success uploading formulaic.json');
            } else {
                console.log(err);
            }
        });
    });
}

module.exports.allformulaic = function(bls_bucket) {
    var command = "php https://storage.cloud.google.com/bls-data/get_formulaic_all.php";
    exec(command, {}, function(error, stdout, stderr) {
        console.log('--fs-grants--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        data_bucket.upload('allformulaic.json', function(err, file) {
            if (!err) {
                console.log('success uploading allformulaic.json');
            } else {
                console.log(err);
            }
        });
    });
}
