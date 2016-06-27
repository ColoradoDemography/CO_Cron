//creates geopts.json - used by special districts map
//from inputs: special districts, munibounds (on GIS Server - dynamic), and counties.php (local - static)
//result contains: coordinates (x,y) - usually centroid (except for counties), and bounding box coords "x1,y1,x2,y2"
//plus attributes: lgid, fips, lgname, lgtype, lgstatus


var fs = require('fs');
var request = require('request');

var pg = require('pg');
var conString = "postgres://codemog:demography@gis.dola.colorado.gov:5433/dola";


//data from lgbasic, lgid_place_crosswalk, csbg_pts, counties and 'districts' in DOLA database will be stored here
var parray = [];


parray[0] = new Promise(function(resolve, reject) {
    request('https://dola.colorado.gov/gis-tmp/lgbasic.json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            resolve(JSON.parse(body));
        } else {
            reject(error);
        }
    });
});


parray[1] = new Promise(function(resolve, reject) {
    fs.readFile('json/lgid_place_crosswalk.json', 'utf8', function(err, data) {
        if (err) {
            reject(err);
        }
        resolve(JSON.parse(data));
    });
});


parray[2] = new Promise(function(resolve, reject) {
    fs.readFile('json/csbg_pts.json', 'utf8', function(err, data) {
        if (err) {
            reject(err);
        }
        resolve(JSON.parse(data));
    });
});


parray[3] = new Promise(function(resolve, reject) {
    fs.readFile('json/counties.json', 'utf8', function(err, data) {
        if (err) {
            reject(err);
        }
        resolve(JSON.parse(data));
    });
});


parray[4] = new Promise(function(resolve, reject) {
    var tablesql = "SELECT lgid, ST_AsGeoJSON(st_transform(ST_Centroid(geom),4326)) as centroid, ST_AsGeoJSON(st_transform(ST_Envelope(geom),4326)) as bbox FROM bounds.districts;";
    execQuery(tablesql, resolve, reject);
});

parray[5] = new Promise(function(resolve, reject) {
    var tablesql = "SELECT city, first_city, ST_AsGeoJSON(st_transform(ST_Centroid(geom),4326)) as centroid, ST_AsGeoJSON(st_transform(ST_Envelope(geom),4326)) as bbox FROM bounds.munibounds;";
    execQuery(tablesql, resolve, reject);
});


Promise.all(parray).then(values => {
    console.log('success');
    processData(values);
});


function processData(data) {

    console.log('processing...');

    var mastershapes = []; //master data obj that will be saved to file

    var lgbasic = data[0];
    var lgid_crosswalk = data[1];
    var csbg_pts = data[2];
    var counties = data[3];
    var districts_data = data[4];
    var muni_data = data[5];


    //Loop through $c_counties - add to $mastershapes
    for (let i = 0; i < counties.length; i = i + 1) {
        mastershapes.push(counties[i]);
    }

    //Loop through $csbgpts - add to $mastershapes
    for (let j = 0; j < csbg_pts.length; j = j + 1) {
        mastershapes.push(csbg_pts[j]);
    }

    var promise_array = [];

    promise_array[0] = new Promise(function(resolve, reject) {
        console.log('enteredpromise0');
        crunch_db_data(districts_data, mastershapes, lgbasic, lgid_crosswalk, resolve, reject);
    });

    promise_array[1] = new Promise(function(resolve, reject) {
        console.log('enteredpromise1');
        crunch_db_data(muni_data, mastershapes, lgbasic, lgid_crosswalk, resolve, reject);
    });


    Promise.all(promise_array).then(values => {
        console.log(values);

        fs.writeFile("geopts.json", JSON.stringify(mastershapes), function(err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });

    });


}


//execute query on postgres/postgis
function execQuery(sql, resolve, reject) {

    var client = new pg.Client(conString); //can use select-only priviledges and make public

    client.connect(function(err) {
        if (err) throw err;

        // execute a query on our database
        client.query(sql, function(err, result) {
            if (err) throw err;

            // disconnect the client
            client.end(function(err) {
                if (err) throw err;
            });

            resolve(result);

        });
    });
}


//lookup fips->lgid
function lookup(fips, json2) {
    for (var i = 0; i < json2.count; i = i + 1) {
        if (fips === json2[i].fips) {
            return json2[i].lgid;
        }
    }
}


//helper function to reformat postgresql results into main array/object format
function crunch_db_data(dataset, output, lgbasic, lgid_crosswalk, resolve, reject) {

    var mainarray = []; //staging

    //put database district query results into staging array
    for (let i = 0; i < dataset.rows.length; i++) {
        mainarray.push(dataset.rows[i]);
    }

    for (let j = 0; j < mainarray.length; j++) {

        //coordinates
        var elem = JSON.parse(mainarray[j].centroid);
        var cen_lng = elem.coordinates[0]; //lng
        var cen_lat = elem.coordinates[1]; //lat  

        //bbox
        var bb = JSON.parse(mainarray[j].bbox);
        var pt1 = bb.coordinates[0][0][0]; //lleft corner lng
        var pt2 = bb.coordinates[0][0][1]; //lleft corner lat  
        var pt3 = bb.coordinates[0][2][0]; //uright corner lng
        var pt4 = bb.coordinates[0][2][1]; //uright corner lat  

        //if no lgid present, will be converted from fips
        var lgid_lookup = mainarray[j].lgid || lookup(mainarray[j].city, lgid_crosswalk);

        for (let k = 0; k < lgbasic.length; k = k + 1) {

            if (lgbasic[k].LG_ID === lgid_lookup) {

                let obj_temp = {
                    'lgid': lgid_lookup,
                    'fips': mainarray[j].city || null,
                    'lgname': lgbasic[k].NAME,
                    'lgtype': lgbasic[k].LGTYPE_ID,
                    'lgstatus': lgbasic[k].LGSTATUS_ID,
                    'bbox': pt1 + ',' + pt2 + ',' + pt3 + ',' + pt4,
                    'coordinates': [cen_lng, cen_lat]
                };

                output.push(obj_temp);

            } //end matching lgid
        } //end loop through lgbasic file
    } //end for loop mainarray

    console.log('exitpromise');
    resolve('success!');

}