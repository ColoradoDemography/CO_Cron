/* DOLA DATABASE BACKUP (requires .pgpass installed, and google api key + instance permissions) */

var exec = require('child_process').exec;

var getTimeStamp = require('./get_timestamp.js');

module.exports = function(db_bucket) {
    var thisrun = getTimeStamp();
    exec('pg_dump -Fc -h 104.197.26.248 -U postgres -w -p 5433 -d dola > db/dola' + thisrun + '.custom', {}, function(error, stdout, stderr) {
        console.log('--db-dump--');
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        db_bucket.upload('db/dola' + thisrun + '.custom', function(err, file) {
            if (!err) {
                console.log('success uploading db/dola' + thisrun + '.custom');
            } else {
                console.log(err);
            }
        });
    });
}
