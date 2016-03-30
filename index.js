var schedule = require('node-schedule');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var mkdirp = require('mkdirp');
var fs = require('fs');


var gcloud = require('gcloud');

var gcs = gcloud.storage({
  projectId: 'dola-gis-server',
  keyFilename: 'root/dola-gis-server-f143cd56dce3.json'
});

var data_bucket = gcs.bucket('co-publicdata');
var db_bucket = gcs.bucket('dola-db-dump');

mkdirp('data', function(err) { 
    console.log('data folder created');
});
mkdirp('db', function(err) { 
    console.log('db folder created');
});


// docker pull royhobbstn/co_cron
// docker run --name nodecron -v /gcp:/root royhobbstn/co_cron


/* DOLA DATABASE BACKUP (requires .pgpass installed, and google api key + instance permissions) */

function getTimeStamp() {
    var now = new Date();
    return ((now.getMonth() + 1) + '-' +
            (now.getDate()) + '-' +
             now.getFullYear() + "_" +
             now.getHours() + '-' +
             ((now.getMinutes() < 10)
                 ? ("0" + now.getMinutes())
                 : (now.getMinutes())) + '-' +
             ((now.getSeconds() < 10)
                 ? ("0" + now.getSeconds())
                 : (now.getSeconds())));
}

var thisrun=getTimeStamp();

//pg_dump dola database
var dola = schedule.scheduleJob('5 22 * * 0', function(){
  exec('pg_dump -Fc -h 104.197.26.248 -U postgres -w -p 5433 -d dola > db/dola' + thisrun + '.custom', {}, function (error, stdout, stderr) {
    console.log('--db-dump--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    db_bucket.upload('db/dola' + thisrun + '.custom', function(err, file) {if (!err) { console.log('success uploading db/dola' + thisrun + '.custom'); } else {console.log(err); } });
    });
});  


/* SPECIAL DISTRICTs (requires google api key + instance permissions) */

//metro districts
var metro = schedule.scheduleJob('10 22 * * 0', function(){
    var command="pgsql2shp -f data/dlmetro -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='6';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--metro--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlmetro.zip data/dlmetro.dbf data/dlmetro.prj data/dlmetro.shp data/dlmetro.shx");
    data_bucket.upload('data/dlmetro.zip', function(err, file) {if (!err) { console.log('success uploading data/dlmetro.zip'); } else {console.log(err); } });
    });
});  

//park districts
var park = schedule.scheduleJob('12 22 * * 0', function(){
    var command="pgsql2shp -f data/dlpark -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='7';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--park--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlpark.zip data/dlpark.dbf data/dlpark.prj data/dlpark.shp data/dlpark.shx;");  
    data_bucket.upload('data/dlpark.zip', function(err, file) {if (!err) { console.log('success uploading data/dlpark.zip'); } else {console.log(err); } });      
    });
});

//fire districts
var fire = schedule.scheduleJob('14 22 * * 0', function(){
    var command="pgsql2shp -f data/dlfire -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='8';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--fire--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlfire.zip data/dlfire.dbf data/dlfire.prj data/dlfire.shp data/dlfire.shx");  
    data_bucket.upload('data/dlfire.zip', function(err, file) {if (!err) { console.log('success uploading data/dlfire.zip'); } else {console.log(err); } });
    });
});

//hospital districts
var hospital = schedule.scheduleJob('16 22 * * 0', function(){
    var command="pgsql2shp -f data/dlhospital -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='9';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--hospital--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlhospital.zip data/dlhospital.dbf data/dlhospital.prj data/dlhospital.shp data/dlhospital.shx");
    data_bucket.upload('data/dlhospital.zip', function(err, file) {if (!err) { console.log('success uploading data/dlhospital.zip'); } else {console.log(err); } });  
    });
});

//water and sanitation districts
var watsan = schedule.scheduleJob('18 22 * * 0', function(){
    var command="pgsql2shp -f data/dlwatersan -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='10' or lgtypeid='11' or lgtypeid='12';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--wat-san--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o zip data/dlwatersan.zip data/dlwatersan.dbf data/dlwatersan.prj data/dlwatersan.shp data/dlwatersan.shx");
    data_bucket.upload('data/dlwatersan.zip', function(err, file) {if (!err) { console.log('success uploading data/dlwatersan.zip'); } else {console.log(err); } });  
    });
});

//library districts
var library = schedule.scheduleJob('20 22 * * 0', function(){
    var command="pgsql2shp -f data/dllibrary -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='16';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--library--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dllibrary.zip data/dllibrary.dbf data/dllibrary.prj data/dllibrary.shp data/dllibrary.shx");
    data_bucket.upload('data/dllibrary.zip', function(err, file) {if (!err) { console.log('success uploading data/dllibrary.zip'); } else {console.log(err); } });  
    });
});

//school districts
var school = schedule.scheduleJob('22 22 * * 0', function(){
    var command="pgsql2shp -f data/dlschool -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='99';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--school--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlschool.zip data/dlschool.dbf data/dlschool.prj data/dlschool.shp data/dlschool.shx");
    data_bucket.upload('data/dlschool.zip', function(err, file) {if (!err) { console.log('success uploading data/dlschool.zip'); } else {console.log(err); } });  
    });
});

//soil districts
var soil = schedule.scheduleJob('24 22 * * 0', function(){
    var command="pgsql2shp -f data/dlsoil -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='20';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--soil--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlsoil.zip data/dlsoil.dbf data/dlsoil.prj data/dlsoil.shp data/dlsoil.shx");
    data_bucket.upload('data/dlsoil.zip', function(err, file) {if (!err) { console.log('success uploading data/dlsoil.zip'); } else {console.log(err); } });  
    });
});

//cemetary districts
var cemetary = schedule.scheduleJob('26 22 * * 0', function(){
    var command="pgsql2shp -f data/dlcemetary -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='15';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--cemetary--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlcemetary.zip data/dlcemetary.dbf data/dlcemetary.prj data/dlcemetary.shp data/dlcemetary.shx");
    data_bucket.upload('data/dlcemetary.zip', function(err, file) {if (!err) { console.log('success uploading data/dlcemetary.zip'); } else {console.log(err); } });
    });
});

//all districts
var all = schedule.scheduleJob('28 22 * * 0', function(){
    var command="pgsql2shp -f data/dlall -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic;\" ";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--all-districts--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/dlall.zip data/dlall.dbf data/dlall.prj data/dlall.shp data/dlall.shx");
    data_bucket.upload('data/dlall.zip', function(err, file) {if (!err) { console.log('success uploading data/dlall.zip'); } else {console.log(err); } });  
    });
});


/* LOAD FROM ORACLE-EXPORTED JSON (requires .pgpass installed) */

//load_lg2cnty
var lg2cnty = schedule.scheduleJob('30 22 * * 0', function(){
    var command="php php/load_lg2cnty.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--lg2cnty--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });
});  

//load_lgbasic
var lgbasic = schedule.scheduleJob('32 22 * * 0', function(){
    var command="php php/load_lgbasic.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--lgbasic--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });
});  

//load_lginfo
var lginfo = schedule.scheduleJob('34 22 * * 0', function(){
    var command="php php/load_lginfo.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--lginfo--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });
});  

//load_limlevy
var limlevy = schedule.scheduleJob('36 22 * * 0', function(){
    var command="php php/load_limlevy.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--limlevy--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });
});  



/* Prepare FS Grants Data Pipeline (requires .pgpass installed, and google api key + instance permissions) */

//create geopts.json & sumtotal.geojson
var fsgrants = schedule.scheduleJob('38 22 * * 0', function(){
    var command="php php/fs_shapes.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--fs-grants--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("php php/fs_data.php");
    data_bucket.upload('php/geopts.json', function(err, file) {if (!err) { console.log('success uploading php/geopts.json'); } else {console.log(err); } });        
    data_bucket.upload('php/sumtotal.geojson', function(err, file) {if (!err) { console.log('success uploading php/sumtotal.geojson'); } else {console.log(err); } });          
    });
});  



/* BLS Data Pipeline (requires google api key + instance permissions) */

//in the future, enable some failsafes so that counties_all can be used for entire USA coverage

var bls = schedule.scheduleJob('50 22 * * 0', function(){
    var command="php bls/bls.php";
    exec(command, {}, function (error, stdout, stderr) {
    console.log('--bls--');
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    data_bucket.upload('bls/json/08_bls.json', function(err, file) {if (!err) { console.log('success uploading bls/json/08_bls.json'); } else {console.log(err); } });        
    });
});
