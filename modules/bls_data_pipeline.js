/* BLS Data Pipeline (requires google api key + instance permissions) */
//in the future, enable some failsafes so that counties_all can be used for entire USA coverage

var exec = require('child_process').exec;


module.exports = function(bls_bucket) {
    var command = "php bls/bls.php";
    exec(command, {}, function(error, stdout, stderr) {
        console.log('--bls--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        bls_bucket.upload('json/08_bls.json', function(err, file) {
            if (!err) {
                console.log('success uploading json/08_bls.json');
            } else {
                console.log(err);
            }
        });
    });
}
