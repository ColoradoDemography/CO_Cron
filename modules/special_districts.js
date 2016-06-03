/* SPECIAL DISTRICTs (requires google api key + instance permissions) */

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

module.exports.metro_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlmetro -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='6';\" ";
    apply_args(data_bucket, command, 'dlmetro', '--metro--');
}

module.exports.park_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlpark -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='7';\" ";
    apply_args(data_bucket, command, 'dlpark', '--park--');
}

module.exports.fire_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlfire -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='8';\" ";
    apply_args(data_bucket, command, 'dlfire', '--fire--');
}

module.exports.hospital_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlhospital -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='9';\" ";
    apply_args(data_bucket, command, 'dlhospital', '--hospital--');
}

module.exports.watsan_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlwatersan -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='10' or lgtypeid='11' or lgtypeid='12';\" ";
    apply_args(data_bucket, command, 'dlwatersan', '--wat-san--');
}

module.exports.library_districts = function(data_bucket){
    var command="pgsql2shp -f data/dllibrary -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='16';\" ";
    apply_args(data_bucket, command, 'dllibrary', '--library--');
}

module.exports.school_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlschool -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='99';\" ";
    apply_args(data_bucket, command, 'dlschool', '--school--');
}

module.exports.soil_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlsoil -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='20';\" ";
    apply_args(data_bucket, command, 'dlsoil', '--soil--');
}

module.exports.cemetary_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlcemetary -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='15';\" ";
    apply_args(data_bucket, command, 'dlcemetary', '--cemetary--');
}

module.exports.all_districts = function(data_bucket){
    var command="pgsql2shp -f data/dlall -h gis.dola.colorado.gov -u codemog -p 5433 -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic;\" ";
    apply_args(data_bucket, command, 'dlall', '--all-districts--');
}


function apply_args(data_bucket, command, filename, tag){
    exec(command, {}, function (error, stdout, stderr) {
    console.log(tag);
    console.log('error: ' + error); console.log('stdout: ' + stdout); console.log('stderr: ' + stderr);
    execSync("zip -o data/" + filename + ".zip data/" + filename + ".dbf data/" + filename + ".prj data/" + filename + ".shp data/" + filename + ".shx");
    data_bucket.upload('data/' + filename + '.zip', function(err, file) {if (!err) { console.log('success uploading data/' + filename + '.zip'); } else {console.log(err); } });  
    });
}
