    var fs = require('fs');
    var request = require('request');
    var gcloud = require('gcloud');

    var gcs = gcloud.storage({
        projectId: 'dola-gis-server',
        keyFilename: 'root/dola-gis-server-f143cd56dce3.json'
    });

    var data_bucket = gcs.bucket('co-publicdata');



module.exports = function(program) {


    var today = formatDate(new Date());

    var a = request("https://gis.dola.colorado.gov/grants/gather?start=01-JAN-2010&end=" + today + "&program=" + program, function(err, res, body) {
        if (!err && res.statusCode === 200) {
            writeCSV(program, body);
        } else {
            console.log(err);
        }
    });

}


    function writeCSV(prg, data) {
      
      if(prg.length>10){prg="ALL";} //multiple programs passed

        fs.writeFile('data/' + prg + '_grants.csv', data, 'utf8', function(err) {
            if (err) {
                console.log('An error occured - file either not saved or corrupted file saved.');
                console.log(err);
            } else {
                console.log(prg + '_grants.csv was saved!');
                toGCloud(prg);
            }
        });

    }

    function toGCloud(prg_nm) {

        data_bucket.upload('data/' + prg_nm + '_grants.csv', {
            gzip: true
        }, function(err, file) {
            if (!err) {
                console.log('success uploading ' + prg_nm + '_grants.csv');
            } else {
                console.log(err);
            }
        });

    }

    function formatDate(today) {

        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        return dd + '-' + monthLookup(mm) + '-' + yyyy;

    }

    function monthLookup(monthnumber) {

        if (monthnumber === 1) {
            return "JAN";
        }
        if (monthnumber === 2) {
            return "FEB";
        }
        if (monthnumber === 3) {
            return "MAR";
        }
        if (monthnumber === 4) {
            return "APR";
        }
        if (monthnumber === 5) {
            return "MAY";
        }
        if (monthnumber === 6) {
            return "JUN";
        }
        if (monthnumber === 7) {
            return "JUL";
        }
        if (monthnumber === 8) {
            return "AUG";
        }
        if (monthnumber === 9) {
            return "SEP";
        }
        if (monthnumber === 10) {
            return "OCT";
        }
        if (monthnumber === 11) {
            return "NOV";
        }
        if (monthnumber === 12) {
            return "DEC";
        }

        console.log('error in month export');
        return "ERR";

    }


