    'use strict';

    /* jshint node: true */

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
  

  
    console.log('in function');

    //--TASK 1-- filter by program and date

    //date range validation
    var min_date = parseDate("01-JAN-12");
    var max_date = parseDate("01-JAN-16");


    //"FML", "SEV_DIST", "VFP", "CTF", "SAR", "FFB", "EIAF", "GAME", "REDI", "DR", "CSBG", "CDBG", "TIRE", "CHPG", "BEAN"
    var program = ["FML", "SEV_DIST", "VFP", "CTF", "SAR", "FFB", "EIAF", "GAME", "REDI", "DR", "CSBG", "CDBG"];

    var county = false;

    var lgid = false;


    //get raw competitve grants =competitve
    var promise1 = new Promise(function(resolve, reject) {

        request({
            url: 'https://dola.colorado.gov/gis-tmp/competitive.json',
            json: true
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var competitivefiltered = _.filter(body, function(chr) {

                    //filter.  assume all false.  remove as you go along.  if still left standing, return true.
                    var flag = false;

                    //date filter  
                    var date_award = parseDate(chr.DATE_OF_AWARD);
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
                        if (!chr.PROGRAM_TYPE) {
                            return false;
                        } //if falsy program value
                        var programident = chr.PROGRAM_TYPE;
                        for (var p = 0; p < program.length; p++) {
                            if (program[p] === programident) {
                                flag = true;
                            }
                        }
                        if (flag === false) {
                            return false;
                        } //all those that didnt match an eligible program
                    }

                    //county filter  
                    if (county) {
                        //reset flag 
                        flag = false;
                        if (!chr.COUNTY) {
                            return false;
                        } //if falsy county value
                        var datac = (chr.COUNTY).split(", "); //create array of counties in data.  comma-space delimited
                        for (m = 0; m < datac.length; m++) {
                            for (n = 0; n < county.length; n++) {
                                if (datac[m] === county[n]) {
                                    flag = true;
                                }
                            }
                        }
                        if (flag === false) {
                            return false;
                        } //all those that didnt match an eligible county       
                    } else {

                        //lgid filter : only applies if no county filter
                        if (lgid) {
                            //reset flag 
                            flag = false;
                            if (!chr.LG_ID) {
                                return false;
                            } //if falsy lgid value
                            var lgc = chr.LG_ID;
                            for (n = 0; n < lgid.length; n++) {
                                if (lgc === lgid[n]) {
                                    flag = true;
                                }
                            }
                            if (flag === false) {
                                return false;
                            } //all those that didnt match an eligible lgid
                        }

                    } //end if/else on county


                    //escaped all filters.  return true.  
                    return true;

                });

                if (competitivefiltered.length > 0) {
                    console.log('competitive success');
                    resolve(competitivefiltered);
                } else {
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

                var formulaicfiltered = _.filter(body, function(chr) {

                    //filter.  assume all false.  remove as you go along.  if still left standing, return true.
                    var flag = false;

                    //date filter  
                    var date_award = parseDate(chr.DIST_DATE);
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
                        if (!chr.PROGRAM_TYPE) {
                            return false;
                        } //if falsy program value
                        var programident = chr.PROGRAM_TYPE;
                        for (var p = 0; p < program.length; p++) {
                            if (program[p] === programident) {
                                flag = true;
                            }
                        }
                        if (flag === false) {
                            return false;
                        } //all those that didnt match an eligible program
                    }

                    //county filter  
                    if (county) {
                        //reset flag 
                        flag = false;
                        if (!chr.COUNTY) {
                            return false;
                        } //if falsy county value
                        var datac = (chr.COUNTY).split(", "); //create array of counties in data.  comma-space delimited
                        for (m = 0; m < datac.length; m++) {
                            for (n = 0; n < county.length; n++) {
                                if (datac[m] === county[n]) {
                                    flag = true;
                                }
                            }
                        }
                        if (flag === false) {
                            return false;
                        } //all those that didnt match an eligible county       
                    } else {

                        //lgid filter : only applies if no county filter
                        if (lgid) {
                            //reset flag 
                            flag = false;
                            if (!chr.LG_ID) {
                                return false;
                            } //if falsy lgid value
                            var lgc = chr.LG_ID;
                            for (n = 0; n < lgid.length; n++) {
                                if (lgc === lgid[n]) {
                                    flag = true;
                                }
                            }
                            if (flag === false) {
                                return false;
                            } //all those that didnt match an eligible lgid
                        }

                    } //end if/else on county


                    //escaped all filters.  return true.  
                    return true;

                });

                if (formulaicfiltered.length > 0) {
                    console.log('formulaic success');
                    resolve(formulaicfiltered);
                } else {
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
            console.log('null');
            //no results
            res.send('no results');
            return;
        }

        var allgrants = [];

        var i;
        for (i = 0; i < competitive.length; i = i + 1) {


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
        }

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

        //splitgrants2counties(allgrants);


    });


    function parseDate(dateofaward) {

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

  
    //join with geo file 
    function crunchfile(result) {

        console.log('joining with geo');

        var grantpts = [];

              request({
            url: 'https://storage.googleapis.com/co-publicdata/geopts.json',
            json: true
        }, function(error, response, body) {


            if (!error && response.statusCode === 200) {


            console.log(result.length);
            console.log(body.length);
            for (var i = 0; i < result.length; i = i + 1) {
                for (var j = 0; j < body.length; j = j + 1) {
                    if (result[i].LG_ID === body[j].lgid) {
                        grantpts.push(
                          {
                                "lgid": body[j].lgid,
                                "lgtype": body[j].lgtype,
                                "lgstatus": body[j].lgstatus,
                                "govname": body[j].lgname,
                                "program": result[i].PROGRAM_TYPE,
                                "projname": result[i].PROJECT_NAME,
                                "projectnmbr": result[i].PROJECT_NMBR,
                                "dateofaward": result[i].DATE_OF_AWARD,
                                "award": result[i].AMT_AWARDED,
                                "latitude": body[j].coordinates[1],
                                "longitude": body[j].coordinates[0]
                           });

                    } //end if
                } //end j
            } //end i

          var fields = ['lgid', 'lgtype', 'lgstatus', 'govname', 'program', 'projname', 'projectnmbr', 'dateofaward', 'award', 'latitude', 'longitude'];
          
          json2csv({ data: grantpts, fields: fields }, function(err, csv) {
  if (err) console.log(err);

                        //write to file
            fs.writeFileSync('grantpts.csv', csv);
            data_bucket.upload('grantpts.csv', function(err, file) {if (!err) { console.log('success uploading grantpts.csv'); } else {console.log(err); } });
            
                
        });
      

            }       
        
});
      


    }


