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

//create geopts.json
    var command="php php/fs_shapes.php";
    exec(command, {}, function (error, stdout, stderr) {
      console.log('--fs-grants--');
      console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
      execSync("php php/fs_data.php");
      data_bucket.upload('php/geopts.json', function(err, file) {if (!err) { console.log('success uploading php/geopts.json'); } else {console.log(err); } });        
    });



