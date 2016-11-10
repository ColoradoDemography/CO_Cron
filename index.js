// docker pull codemog/co_cron
//docker run --name nodecron -d -v /gcp:/root codemog/co_cron

var schedule = require('node-schedule');
var mkdirp = require('mkdirp');


var gcloud = require('gcloud');
var gcs = gcloud.storage({
  projectId: 'dola-gis-server',
  keyFilename: 'root/dola-gis-server-f143cd56dce3.json'
});
var data_bucket = gcs.bucket('co-publicdata');
var db_bucket = gcs.bucket('dola-db-dump');
var bls_bucket = gcs.bucket('bls-data');

var winston = require('winston');
var fs = require('fs');
var env = process.env.NODE_ENV || 'development';
var logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
var tsFormat = () => (new Date()).toLocaleTimeString();
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});

mkdirp('data', function(err) { console.log('data folder created'); });
mkdirp('db', function(err) { console.log('db folder created'); });


// Require Custom Modules
var sd = require('./modules/special_districts.js');
var dump_dola_database = require('./modules/dump_database.js');
var bls_data_pipeline = require('./modules/bls_data_pipeline.js');
var grants_data_pipeline = require('./modules/grants_data_pipeline.js');
var dola_data_upload = require('./modules/dola_data_upload.js');
var grants_export = require('./modules/grants_export.js');

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

logger.info(all);

/* LOAD FROM ORACLE-EXPORTED JSON (requires .pgpass installed) */
var lg2cnty = schedule.scheduleJob('30 22 * * 0', function(){ dola_data_upload.lg2cnty(); });  
var lgbasic = schedule.scheduleJob('32 22 * * 0', function(){ dola_data_upload.lgbasic(); });  
var lginfo = schedule.scheduleJob('34 22 * * 0', function(){ dola_data_upload.lginfo(); });  
var limlevy = schedule.scheduleJob('36 22 * * 0', function(){ dola_data_upload.limlevy(); });  

/* Prepare FS Grants Data (requires .pgpass installed, and google api key + instance permissions) */
var fsgrants = schedule.scheduleJob('38 22 * * 0', function(){ grants_data_pipeline.fsgrants(data_bucket); });  
var geopts = schedule.scheduleJob('40 22 * * 0', function(){ grants_data_pipeline.geopts(data_bucket); });  

/* BLS Data Pipeline */
var bls = schedule.scheduleJob('42 22 * * *', function(){ bls_data_pipeline(bls_bucket); });

/* Grant Program Exports */
var fml = schedule.scheduleJob('44 22 * * 0', function(){ grants_export('FML'); });  
var sev_dist = schedule.scheduleJob('45 22 * * 0', function(){ grants_export('SEV_DIST'); });
var vfp = schedule.scheduleJob('46 22 * * 0', function(){ grants_export('VFP'); });
var ctf = schedule.scheduleJob('47 22 * * 0', function(){ grants_export('CTF'); });
var sar = schedule.scheduleJob('48 22 * * 0', function(){ grants_export('SAR'); });
var ffb = schedule.scheduleJob('49 22 * * 0', function(){ grants_export('FFB'); });
var eiaf = schedule.scheduleJob('50 22 * * 0', function(){ grants_export('EIAF'); });
var game = schedule.scheduleJob('51 22 * * 0', function(){ grants_export('GAME'); });
var redi = schedule.scheduleJob('52 22 * * 0', function(){ grants_export('REDI'); });
var dr = schedule.scheduleJob('53 22 * * 0', function(){ grants_export('DR'); });
var csbg = schedule.scheduleJob('54 22 * * 0', function(){ grants_export('CSBG'); });
var cdbg = schedule.scheduleJob('55 22 * * 0', function(){ grants_export('CDBG'); });
var all = schedule.scheduleJob('56 22 * * 0', function(){ grants_export('FML,SEV_DIST,VFP,CTF,SAR,FFB,EIAF,GAME,REDI,DR,CSBG,CDBG'); });

logger.info(all);
