var schedule = require('node-schedule');
var exec = require('child_process').exec;
var mkdirp = require('mkdirp');

mkdirp('data', function(err) { 
    console.log('data folder created');
});

//metro districts
var a = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlmetro -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='6';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//park districts
var b = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlpark -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='7';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//fire districts
var c = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlfire -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='8';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//hospital districts
var d = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlhospital -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='9';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//water and sanitation districts
var e = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlwatersan -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='10' or lgtypeid='11' or lgtypeid='12';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//library districts
var f = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dllibrary -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='16';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//school districts
var g = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlschool -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='99';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//soil districts
var h = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlsoil -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='20';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//cemetary districts
var i = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlcemetary -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='15';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//all districts
var j = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlall -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic;\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});


//zip metro districts
var aa = schedule.scheduleJob('* * * * *', function(){
    var command="zip -o data/dlmetro.zip data/dlmetro.dbf data/dlmetro.prj data/dlmetro.shp data/dlmetro.shx";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

/*

//zip park districts
var bb = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlpark -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='7';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//zip fire districts
var cc = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlfire -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='8';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//zip hospital districts
var dd = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlhospital -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='9';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//zip water and sanitation districts
var ee = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlwatersan -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='10' or lgtypeid='11' or lgtypeid='12';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//zip library districts
var ff = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dllibrary -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='16';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//zip school districts
var gg = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlschool -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='99';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//zip soil districts
var hh = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlsoil -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='20';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//zip cemetary districts
var ii = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlcemetary -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='15';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});

//zip all districts
var jj = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f /var/www/html/data/shp/districts/dlall -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic;\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
});
*/