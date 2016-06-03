/* LOAD FROM ORACLE-EXPORTED JSON (requires .pgpass installed) */

var exec = require('child_process').exec;

//load_lg2cnty
module.exports.lg2cnty = function(){
    var command="php php/load_lg2cnty.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--lg2cnty--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });
};

//load_lgbasic
module.exports.lgbasic = function(){
    var command="php php/load_lgbasic.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--lgbasic--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });
};  

//load_lginfo
module.exports.lginfo = function(){
    var command="php php/load_lginfo.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--lginfo--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });
};  

//load_limlevy
module.exports.limlevy = function(){
    var command="php php/load_limlevy.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--limlevy--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });
};  

