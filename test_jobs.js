'use strict';

var mkdirp = require('mkdirp');


var gcloud = require('gcloud');
var gcs = gcloud.storage({
  projectId: 'dola-gis-server',
  keyFilename: 'root/dola-gis-server-7b71706a971f.json'
});
var data_bucket = gcs.bucket('co-publicdata');
var db_bucket = gcs.bucket('dola-db-dump');

mkdirp('data', function(err) { 
  if(err) console.log(err); 
});

mkdirp('db', function(err) {
  if(err) console.log(err); 
});


// Require Custom Modules
var sd = require('./modules/special_districts.js');
var dump_dola_database = require('./modules/dump_database.js');
var bls_data_pipeline = require('./modules/bls_data_pipeline.js');
var grants_data_pipeline = require('./modules/grants_data_pipeline.js');
var dola_data_upload = require('./modules/dola_data_upload.js');


const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('');
console.log('1: Backup DOLA Database');
console.log('2: BLS Data Pipeline');
console.log('3: DOLA Data Upload lg2cnty');
console.log('4: DOLA Data Upload lgbasic');
console.log('5: DOLA Data Upload lginfo');
console.log('6: DOLA Data Upload limlevy');
console.log('7: Grants Pipeline geopts');
console.log('8: Grants Pipeline grants');
console.log('9: Export Districts: dlmetro');
console.log('10: Export Districts: dlpark');
console.log('11: Export Districts: dlfire');
console.log('12: Export Districts: dlhospital');
console.log('13: Export Districts: dlwatersan');
console.log('14: Export Districts: dllibrary');
console.log('15: Export Districts: dlschool');
console.log('16: Export Districts: dlsoil');
console.log('17: Export Districts: dlcemetary');
console.log('18: Export Districts: dlall');
console.log('');

rl.question('Which Job Would you like to Test? ', (answer) => {
console.log('');
  
  if(answer==="1"){
  console.log('Running Task #1');
  dump_dola_database(db_bucket);
  }
  
  if(answer==="2"){
  console.log('Running Task #2');
  bls_data_pipeline(data_bucket);
  }
  
  if(answer==="3"){
  console.log('Running Task #3');
  dola_data_upload.lg2cnty();
  }
  
  if(answer==="4"){
  console.log('Running Task #4');
  dola_data_upload.lgbasic();
  }
  
  if(answer==="5"){
  console.log('Running Task #5');
  dola_data_upload.lginfo();
  }
  
  if(answer==="6"){
  console.log('Running Task #6');
  dola_data_upload.limlevy();
  }
  
  if(answer==="7"){
  console.log('Running Task #7');
  grants_data_pipeline.geopts(data_bucket);
  }
  
  if(answer==="8"){
  console.log('Running Task #8');
  grants_data_pipeline.fsgrants(data_bucket);
  }
  
  if(answer==="9"){
  console.log('Running Task #9');
  sd.metro_districts(data_bucket);
  }
  
  if(answer==="10"){
  console.log('Running Task #10');
  sd.park_districts(data_bucket);
  }
  
  if(answer==="11"){
  console.log('Running Task #11');
  sd.fire_districts(data_bucket);
  }
  
  if(answer==="12"){
  console.log('Running Task #12');
  sd.hospital_districts(data_bucket);
  }
  
  if(answer==="13"){
  console.log('Running Task #13');
  sd.watsan_districts(data_bucket);
  }
  
  if(answer==="14"){
  console.log('Running Task #14');
  sd.library_districts(data_bucket);
  }
  
  if(answer==="15"){
  console.log('Running Task #15');
  sd.school_districts(data_bucket);
  }
  
  if(answer==="16"){
  console.log('Running Task #16');
  sd.soil_districts(data_bucket);
  }
  
  if(answer==="17"){
  console.log('Running Task #17');
  sd.cemetary_districts(data_bucket);
  }
  
  if(answer==="18"){
  console.log('Running Task #18');
  sd.all_districts(data_bucket);
  }
  
  rl.close();
  
});
