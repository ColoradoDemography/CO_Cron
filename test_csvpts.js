    'use strict';

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var mkdirp = require('mkdirp');

    var _ = require('lodash');
    var request = require('request'); //async load json
    var Promise = require('es6-promise').Promise;
    var json2csv = require('json2csv');
    var fs = require("fs"); //filestream

  
  var gcloud = require('gcloud');

var gcs = gcloud.storage({
  projectId: 'dola-gis-server',
  keyFilename: 'root/dola-gis-server-f143cd56dce3.json'
});

var data_bucket = gcs.bucket('co-publicdata');

//create grantpts.csv for CO_Grants Application
    var command="node js/csv.js";
    exec(command, {}, function (error, stdout, stderr) {
      console.log('--cogrants--started--');
      console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    });




