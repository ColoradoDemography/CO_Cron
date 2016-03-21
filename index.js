var schedule = require('node-schedule');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var mkdirp = require('mkdirp');
var fs = require('fs');


var gcloud = require('gcloud');

var gcs = gcloud.storage({
  projectId: 'dola-gis-server',
  keyFilename: 'key/dola-gis-server-f143cd56dce3.json'
});

var bucket = gcs.bucket('co-publicdata');

bucket.acl.default.add({
    entity: 'allUsers',
    role: gcs.acl.READER_ROLE
}, function(err) {});


mkdirp('data', function(err) { 
    console.log('data folder created');
});

//metro districts
var a = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlmetro -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='6';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlmetro.zip data/dlmetro.dbf data/dlmetro.prj data/dlmetro.shp data/dlmetro.shx");
    bucket.upload('data/dlmetro.zip', function(err, file) {if (!err) { console.log('success with data/dlmetro.zip'); } else {console.log(err); } });
    });
});  


//park districts
var b = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlpark -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='7';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlpark.zip data/dlpark.dbf data/dlpark.prj data/dlpark.shp data/dlpark.shx;");  
    bucket.upload('data/dlpark.zip', function(err, file) {if (!err) { console.log('success with data/dlpark.zip'); } else {console.log(err); } });      
    });
});
/*
//fire districts
var c = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlfire -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='8';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlfire.zip data/dlfire.dbf data/dlfire.prj data/dlfire.shp data/dlfire.shx");  
    });
});

//hospital districts
var d = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlhospital -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='9';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlhospital.zip data/dlhospital.dbf data/dlhospital.prj data/dlhospital.shp data/dlhospital.shx");   
    });
});

//water and sanitation districts
var e = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlwatersan -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='10' or lgtypeid='11' or lgtypeid='12';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o zip data/dlwatersan.zip data/dlwatersan.dbf data/dlwatersan.prj data/dlwatersan.shp data/dlwatersan.shx");    
    });
});

//library districts
var f = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dllibrary -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='16';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dllibrary.zip data/dllibrary.dbf data/dllibrary.prj data/dllibrary.shp data/dllibrary.shx"); 
    });
});

//school districts
var g = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlschool -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='99';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlschool.zip data/dlschool.dbf data/dlschool.prj data/dlschool.shp data/dlschool.shx"); 
    });
});

//soil districts
var h = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlsoil -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='20';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlsoil.zip data/dlsoil.dbf data/dlsoil.prj data/dlsoil.shp data/dlsoil.shx");   
    });
});

//cemetary districts
var i = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlcemetary -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='15';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlcemetary.zip data/dlcemetary.dbf data/dlcemetary.prj data/dlcemetary.shp data/dlcemetary.shx");    
    });
});

//all districts
var j = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlall -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic;\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlall.zip data/dlall.dbf data/dlall.prj data/dlall.shp data/dlall.shx");    
    });
});
*/

