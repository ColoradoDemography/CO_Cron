var schedule = require('node-schedule');
var exec = require('child_process').exec;

var j = schedule.scheduleJob('* * * * *', function(){
    var command="pgsql2shp -f data/dlmetro -h 54.69.15.55 -u codemog -P demography dola \"select lgid,source,geom,lgname,lgtypeid,lgstatusid,abbrev_name,mail_address,alt_address,mail_city,mail_state,mail_zip,url,prev_name from dola.bounds.districts natural join dola.bounds.lgbasic where lgtypeid='6';\" ";
    exec(command, {}, function (error, stdout, stderr) {
    // if you also want to change current process working directory:
    console.log('error: ' + error);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);      
    });
  
});


