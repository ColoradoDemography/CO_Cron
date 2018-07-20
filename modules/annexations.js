/* Municipalities */

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;




module.exports.annexations = function(data_bucket) {
    var command = "pgsql2shp -f data/annexations -h 104.197.26.248 -u codemog -p 5433 -P demography dola \"select rec_num,county,city,cl_re_date,descr,ord_num,type,notes,cityname,geom from dola.bounds.annexations;\" ";
    apply_args(data_bucket, command, 'Annexations', '--annex--');
}

module.exports.deannexations = function(data_bucket) {
    var command = "pgsql2shp -f data/deannexations -h 104.197.26.248 -u codemog -p 5433 -P demography dola \"select rec_num,county,city,cl_re_date,descr,ord_num,type,notes,cityname,geom from dola.bounds.deannexations;\" ";
    apply_args(data_bucket, command, 'DeAnnexations', '--deannex--');
}

module.exports.dola_muni = function(data_bucket) {
    var command = "pgsql2shp -f data/dola_muni -h 104.197.26.248 -u codemog -p 5433 -P demography dola \"select statefp,geoid,namelsad,city,cityname,geom from dola.bounds.dola_muni;\" ";
    apply_args(data_bucket, command, 'Dola_Muni', '--dola_muni--');
}

module.exports.muni_bounds = function(data_bucket) {
    var command = "pgsql2shp -f data/munibounds -h 104.197.26.248 -u codemog -p 5433 -P demography dola \"select city,first_city,geom from dola.bounds.munibounds;\" ";
    apply_args(data_bucket, command, 'MuniBounds', '--muni--');
}

module.exports.muni_bounds = function(data_bucket) {
    var command = "pgsql2shp -f data/web_annexations -h 104.197.26.248 -u codemog -p 5433 -P demography dola \"select rec_num,county,city,cl_re_date,descr,ord_num,type,notes,cityname,geom from dola.bounds.web_annexations;\" ";
    apply_args(data_bucket, command, 'Web_Annexations', '--web_annex--');
}

function apply_args(data_bucket, command, filename, tag) {
    exec(command, {}, function(error, stdout, stderr) {
        console.log(tag);
        console.log('error: ' + error);
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        execSync("zip -o data/" + filename + ".zip data/" + filename + ".dbf data/" + filename + ".prj data/" + filename + ".shp data/" + filename + ".shx");
        data_bucket.upload('data/' + filename + '.zip', function(err, file) {
            if (!err) {
                console.log('success uploading data/' + filename + '.zip');
            } else {
                console.log(err);
            }
        });
    });
}
