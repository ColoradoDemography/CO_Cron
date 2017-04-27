'use strict';


var _ = require('lodash');
var request = require('request'); //async load json
var Promise = require('es6-promise').Promise;
var json2csv = require('json2csv');
var fs = require("fs"); //filestream


var gcloud = require('gcloud');

var gcs = gcloud.storage({
    projectId: 'dola-gis-server',
    keyFilename: 'root/dola-gis-server-79665239667c.json'
});

var data_bucket = gcs.bucket('co-publicdata');



console.log('in function');

//--TASK 1-- filter by program and date

//date range validation
var min_date = new Date(2012, 0, 1);
var max_date = new Date();


//all programs not listed below will be filtered out
var program = ["CDBG","CSBG","DR","EIAF","GAME","REDI","CTF","FFB","FML","FML_SB106","SAR","SEV_DIST","VFP", "MJ"];


  //get raw competitve grants =competitve
var promise1 = new Promise(function(resolve, reject) {

    request({
        url: 'https://dola.colorado.gov/gis-tmp/competitive2.json',
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            var competitivefiltered = _.filter(body, function(competitive_data) {

                //filter.  assume all false.  remove as you go along.  if still left standing, return true.
                var flag = false;

                //date filter  
                var date_award = parseDate(competitive_data.DATE_OF_AWARD, competitive_data);
                if (date_award >= min_date && date_award <= max_date) {
                    flag = true;
                }
                if (flag === false) {
                    return false;
                } //all those that didnt match the date range


                //program filter
                if (program) {
                    //reset flag 
                    flag = false;
                    if (!competitive_data.PROGRAM_TYPE) {
                        console.log('reject, falsy prog type: ' + competitive_data);
                        return false;
                    } //if falsy program value

                    for (var p = 0; p < program.length; p++) {
                        if (program[p] === competitive_data.PROGRAM_TYPE) {
                            flag = true;
                        }
                    }
                    if (flag === false) {
                        console.log('reject, didnt match valid prog type: ' + JSON.stringify(competitive_data));
                        return false;
                    } //all those that didnt match an eligible program
                }


                return true;

            });

            if (competitivefiltered.length > 0) {
                console.log('competitive success');
                resolve(competitivefiltered);
            } else {
                console.log('failed competitive promise');
                resolve("");
            }

        }
    });

});


//get raw formulaic grants =formulaic
var promise2 = new Promise(function(resolve, reject) {

    request({
        url: 'https://dola.colorado.gov/gis-tmp/formulaic.json',
        json: true
    }, function(error, response, body) {


        if (!error && response.statusCode === 200) {

            var formulaicfiltered = _.filter(body, function(formulaic_data) {

                //filter.  assume all false.  remove as you go along.  if still left standing, return true.
                var flag = false;

                //date filter  
                var date_award = parseDate(formulaic_data.DIST_DATE, formulaic_data);
                if (date_award >= min_date && date_award <= max_date) {
                    flag = true;
                }
                if (flag === false) {
                    return false;
                } //all those that didnt match the date range


                //program filter
                if (program) {
                  var programtype = formulaic_data.PROGRAM_TYPE;
                  
                    //reset flag 
                    flag = false;
                    if (!formulaic_data.PROGRAM_TYPE) {
                        //reject
                        console.log('reject, falsy prog type: ' + formulaic_data);
                        return false;
                    } //if falsy program value
                  
                    
                    for (var p = 0; p < program.length; p++) {
                        if (program[p] === programtype) {
                            flag = true;
                        }
                    }
                    if (flag === false) {
                        console.log('reject, didnt match valid prog type: ' + JSON.stringify(formulaic_data));
                        return false;
                    } //all those that didnt match an eligible program
                }


                //escaped all filters.  return true.  
                return true;

            });

            if (formulaicfiltered.length > 0) {
                console.log('formulaic success');
                resolve(formulaicfiltered);
            } else {
                console.log('failed formulaic promise');
                resolve("");
            }

        }
    });

});


//combine to common schema =grantscombined
//wait for both promises to complete
Promise.all([promise1, promise2]).then(function(values) {
  
    console.log('promises resolved');
    var competitive = values[0];
    var formulaic = values[1];

    if ((competitive.length + formulaic.length) === 0) {
        res.send('no results');
        return;
    }


    var assign_lgid = require("./assign_lgid.js");

    var allgrants = [];

  
    for (var i = 0; i < competitive.length; i = i + 1) {

      //if no LGID, try to match with one
      if(competitive[i].LG_ID==null){
        competitive[i].LG_ID = assign_lgid(competitive[i].APPLICANT_TITLE);
      }
        
        allgrants.push({
            "LG_ID": competitive[i].LG_ID,
            "COUNTY": competitive[i].COUNTY,
            "PROJECT_NMBR": competitive[i].PROJECT_NMBR,
            "PROGRAM_TYPE": competitive[i].PROGRAM_TYPE,
            "PROJECT_TYPE": competitive[i].PROJECT_TYPE,
            "PROJECT_NAME": competitive[i].PROJECT_NAME,
            "PROJECT_DESCRIPTION": competitive[i].PROJECT_DESCRIPTION,
            "ENTITY_APPLICANT": competitive[i].APPLICANT_TITLE,
            "DATE_OF_AWARD": competitive[i].DATE_OF_AWARD,
            "FY_AWARD": competitive[i].FY_AWARD,
            "EXECUTION_DATE": competitive[i].EXECUTION_DATE,
            "FY_EXEC": competitive[i].FY_EXEC,
            "AMT_AWARDED": competitive[i].AMT_AWARDED,
            "AMT_SEVERANCE": competitive[i].AMT_SEVERANCE,
            "AMT_MINERAL": competitive[i].AMT_MINERAL,
            "MATCHING_FUNDS": competitive[i].MATCHING_FUNDS,
            "MEASURABLE": competitive[i].MEASURABLE,
            "REGION_MANAGER": competitive[i].REGION_MANAGER,
            "FS_REGIONS": competitive[i].FS_REGIONS
        });

    } //end competitive

    for (i = 0; i < formulaic.length; i = i + 1) {
      
        allgrants.push({
            "LG_ID": formulaic[i].LG_ID,
            "COUNTY": formulaic[i].COUNTY,
            "PROJECT_NMBR": null,
            "PROGRAM_TYPE": formulaic[i].PROGRAM_TYPE,
            "PROJECT_TYPE": null,
            "PROJECT_NAME": null,
            "PROJECT_DESCRIPTION": null,
            "ENTITY_APPLICANT": formulaic[i].ENTITY_NAME,
            "DATE_OF_AWARD": formulaic[i].DIST_DATE,
            "FY_AWARD": formulaic[i].FISCAL_YEAR,
            "EXECUTION_DATE": formulaic[i].DIST_DATE,
            "FY_EXEC": formulaic[i].FISCAL_YEAR,
            "AMT_AWARDED": formulaic[i].DIST_AMOUNT,
            "AMT_SEVERANCE": null,
            "AMT_MINERAL": null,
            "MATCHING_FUNDS": null,
            "MEASURABLE": null,
            "REGION_MANAGER": null,
            "FS_REGIONS": null
        });

    }

    crunchfile(allgrants);

});


function parseDate(dateofaward, obj) {

    var splitdate;

    //if date is undefined in source data, it will fall through to second return
    if (dateofaward) {

        splitdate = dateofaward.split("-");

        var awardday = parseInt(splitdate[0]);
        var awardmonth = splitdate[1];
        var awardyear = splitdate[2];

        //hopefully my code doesn't last long enough where this will be a problem
        var preyear = ""; //adds correct century digits if needed
        if (parseInt(awardyear) > 50 && parseInt(awardyear) < 100) {
            preyear = "19";
        }
        if (parseInt(awardyear) < 49) {
            preyear = "20";
        }

        awardyear = preyear + awardyear;

        return new Date(parseInt(awardyear), convertmonthtext(awardmonth), awardday);

    }

    console.log(obj); //invalid date.  flag and fix.
    return new Date(1950, 0, 1); //no date passed - flag error later for data validation
}

//functions
function convertmonthtext(monthtext) {
    if (monthtext === "JAN") {
        return 0;
    }
    if (monthtext === "FEB") {
        return 1;
    }
    if (monthtext === "MAR") {
        return 2;
    }
    if (monthtext === "APR") {
        return 3;
    }
    if (monthtext === "MAY") {
        return 4;
    }
    if (monthtext === "JUN") {
        return 5;
    }
    if (monthtext === "JUL") {
        return 6;
    }
    if (monthtext === "AUG") {
        return 7;
    }
    if (monthtext === "SEP") {
        return 8;
    }
    if (monthtext === "OCT") {
        return 9;
    }
    if (monthtext === "NOV") {
        return 10;
    }
    if (monthtext === "DEC") {
        return 11;
    }
}


//extract only needed fields from main grantsfile and export as csv
function crunchfile(result) {

    console.log('subset');

    var grantpts = [];
     

            for (var i = 0; i < result.length; i = i + 1) {

              if(result[i].LG_ID){
                
                        grantpts.push({
                            "award": result[i].AMT_AWARDED,
                            "projname": result[i].PROJECT_NAME,        
                            "projectnmbr": result[i].PROJECT_NMBR,
                            "dateofaward": result[i].DATE_OF_AWARD,       
                            "lgid": result[i].LG_ID,
                            "program": result[i].PROGRAM_TYPE,
                            "county": result[i].COUNTY
                        });  
              }


            } //end i

            var fields = ['award', 'projname', 'projectnmbr', 'dateofaward', 'lgid', 'program', 'county'];
          
            json2csv({
                data: grantpts,
                fields: fields
            }, function(err, csv) {
                if (err) console.log(err);
                fs.writeFileSync('grants.csv', csv);
                data_bucket.upload('grants.csv', { gzip: true }, function(err, file) {
                    if (!err) {
                        console.log('success uploading grants.csv');
                    } else {
                        console.log(err);
                    }
                });
            });

}
