// docker pull royhobbstn/co_cron
// docker run --name nodecron -v /gcp:/root royhobbstn/co_cron

var schedule = require('node-schedule');
var mkdirp = require('mkdirp');


var gcloud = require('gcloud');
var gcs = gcloud.storage({
  projectId: 'dola-gis-server',
  keyFilename: 'root/dola-gis-server-f143cd56dce3.json'
});
var data_bucket = gcs.bucket('co-publicdata');
var db_bucket = gcs.bucket('dola-db-dump');

mkdirp('data', function(err) { console.log('data folder created'); });
mkdirp('db', function(err) { console.log('db folder created'); });


// Require Custom Modules
var sd = require('./modules/special_districts.js');
var dump_dola_database = require('./modules/dump_database.js');
var bls_data_pipeline = require('./modules/bls_data_pipeline.js');
var grants_data_pipeline = require('./modules/grants_data_pipeline.js');
var dola_data_upload = require('./modules/dola_data_upload.js');

//temp test tasks
//bls_data_pipeline(data_bucket);


/*  SCHEDULED TASKS  */

//pg_dump Dola Database
var dola = schedule.scheduleJob('5 22 * * 0', function(){ dump_dola_database(db_bucket); });  

/* SPECIAL DISTRICTs (requires google api key + instance permissions) */
var metro = schedule.scheduleJob('10 22 * * 0', function(){ sd.metro_districts(data_bucket); });  
var park = schedule.scheduleJob('12 22 * * 0', function(){ sd.park_districts(data_bucket); });
var fire = schedule.scheduleJob('14 22 * * 0', function(){ sd.fire_districts(data_bucket); });
var hospital = schedule.scheduleJob('16 22 * * 0', function(){ sd.hospital_districts(data_bucket); });
var watsan = schedule.scheduleJob('18 22 * * 0', function(){ sd.watsan_districts(data_bucket); });
var library = schedule.scheduleJob('20 22 * * 0', function(){ sd.library_districts(data_bucket); });
var school = schedule.scheduleJob('22 22 * * 0', function(){ sd.school_districts(data_bucket); });
var soil = schedule.scheduleJob('24 22 * * 0', function(){ sd.soil_districts(data_bucket); });
var cemetary = schedule.scheduleJob('26 22 * * 0', function(){ sd.cemetary_districts(data_bucket); });
var all = schedule.scheduleJob('28 22 * * 0', function(){ sd.all_districts(data_bucket); });

/* LOAD FROM ORACLE-EXPORTED JSON (requires .pgpass installed) */
var lg2cnty = schedule.scheduleJob('30 22 * * 0', function(){ dola_data_upload.lg2cnty(); });  
var lgbasic = schedule.scheduleJob('32 22 * * 0', function(){ dola_data_upload.lgbasic(); });  
var lginfo = schedule.scheduleJob('34 22 * * 0', function(){ dola_data_upload.lginfo(); });  
var limlevy = schedule.scheduleJob('36 22 * * 0', function(){ dola_data_upload.limlevy(); });  

/* Prepare FS Grants Data (requires .pgpass installed, and google api key + instance permissions) */
var fsgrants = schedule.scheduleJob('38 22 * * 0', function(){ grants_data_pipeline.fsgrants(data_bucket); });  
var csvpts = schedule.scheduleJob('40 22 * * 0', function(){ grants_data_pipeline.csvpts(data_bucket); });  

/* BLS Data Pipeline */
var bls = schedule.scheduleJob('50 22 * * 0', function(){ bls_data_pipeline(data_bucket); });

