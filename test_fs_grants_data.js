 'use strict';

var exec = require('child_process').exec;
var gcloud = require('gcloud');

var gcs = gcloud.storage({
  projectId: 'dola-gis-server',
  keyFilename: 'root/dola-gis-server-7b71706a971f.json'
});

var data_bucket = gcs.bucket('co-publicdata');

//create grantpts.csv for CO_Grants Application
    var command="node js/grants.js";
      exec(command, {}, function (error, stdout, stderr) {
      console.log('--cogrants--started--');
      console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });




