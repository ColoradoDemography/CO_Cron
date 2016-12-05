'use strict';

var exec = require('child_process').exec;
var gcloud = require('gcloud');


var gcs = gcloud.storage({
  projectId: 'dola-gis-server',
  keyFilename: 'root/dola-gis-server-79665239667c.json'
});

var data_bucket = gcs.bucket('co-publicdata');

//create geopts.json
    var command="node js/geopts.js";
      exec(command, {}, function (error, stdout, stderr) {
      console.log('--geopts.json--');
      console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
      data_bucket.upload('geopts.json', function(err, file) {if (!err) { console.log('success uploading geopts.json'); } else {console.log(err); } });        
    });



