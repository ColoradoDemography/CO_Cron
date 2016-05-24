<?php
//creates geopts.json
//from inputs: special districts, munibounds (on GIS Server - dynamic), and counties.php (local - static)
//result contains: coordinates (x,y) - usually centroid (except for counties), and bounding box coords "x1,y1,x2,y2"
//plus attributes: lgid, fips, lgname, lgtype, lgstatus

//gis server connection string
$host = "host=gis.dola.colorado.gov";
$port = "port=5433";
$dbname = "dbname=dola";
$credentials = "user=postgres";

require "/root/pg.php";

$mastershapes = []; //master data obj (convert to json and save to file)

//counties always the same
require 'counties.php';


$str = file_get_contents('https://dola.colorado.gov/gis-tmp/lgbasic.json');
$lgbasic = json_decode($str, true); // decode the JSON into an competitive associative array


$str2 = file_get_contents('php/lgid_place_crosswalk.json');
$json2 = json_decode($str2, true); // decode the JSON into an formulaic associative array

// havent figured out what to do with this yet
$csbgraw = file_get_contents('php/csbg_pts.json');
$csbgpts = json_decode($csbgraw, true); 
$keyraw = file_get_contents('php/csbg_key.json');
$csbgkey = json_decode($keyraw, true); 



// attempt a connection 
$dbh = pg_connect("$host $port $dbname $credentials $password");

if (!$dbh) {
    die("Error in connection: " . pg_last_error());
}


  $tablesql="SELECT lgid, ST_AsGeoJSON(st_transform(ST_Centroid(" . pg_escape_string('geom') . "),4326)) as centroid, ST_AsGeoJSON(st_transform(ST_Envelope(" . pg_escape_string('geom') . "),4326)) as bbox FROM bounds.districts;";

  $tableresult = pg_query($dbh, $tablesql);
  
$mainarray=[];

//create assoc array
while ($tablerow = pg_fetch_array($tableresult)) {
    array_push($mainarray,$tablerow);
  }

//loop through assoc array.  construct object
for($i=0;$i<count($mainarray);$i=$i+1){
  
  //coordinates
  $elem = json_decode($mainarray[$i]['centroid'], true);
  $cen_lng = ($elem['coordinates'][0]); //lng
  $cen_lat = ($elem['coordinates'][1]); //lat  
  
  //bbox
   $elem = json_decode($mainarray[$i]['bbox'], true);
  $pt1 = ($elem['coordinates'][0][0][0]); //lleft corner lng
  $pt2 = ($elem['coordinates'][0][0][1]); //lleft corner lat  
  $pt3 = ($elem['coordinates'][0][2][0]); //uright corner lng
  $pt4 = ($elem['coordinates'][0][2][1]); //uright corner lat  
  
  $lgid_lookup = $mainarray[$i]['lgid'];
  
  
for($j=0;$j<count($lgbasic);$j=$j+1){

  if($lgbasic[$j]['LG_ID']==$lgid_lookup){
      $objarray = array(
        'lgid' => $lgid_lookup,
        'fips' => null,
        'lgname' => $lgbasic[$j]['NAME'],
        'lgtype' => $lgbasic[$j]['LGTYPE_ID'],
        'lgstatus' => $lgbasic[$j]['LGSTATUS_ID'],
        'bbox' => $pt1.','.$pt2.','.$pt3.','.$pt4,
        'coordinates' => [$cen_lng, $cen_lat]
      );
    
    array_push($mastershapes, $objarray);
    
  } //end matching lgid

} //end loop through lgbasic file

} //end loop through postgis district result set



//next up, munis!

//lookup fips->lgid
function lookup($fips, $json2){
  
  for($i=0;$i<count($json2);$i=$i+1){

    if($fips==$json2[$i]['fips']){
      return $json2[$i]['lgid'];
    }
  }
  
}

  $t="SELECT city, first_city, ST_AsGeoJSON(st_transform(ST_Centroid(" . pg_escape_string('geom') . "),4326)) as centroid, ST_AsGeoJSON(st_transform(ST_Envelope(" . pg_escape_string('geom') . "),4326)) as bbox FROM bounds.munibounds;";

  $tableresult = pg_query($dbh, $t);
  
$mainarray2=[];

//create assoc array
while ($tablerow = pg_fetch_array($tableresult)) {
    array_push($mainarray2,$tablerow);
  }

//print_r($mainarray2);



//loop through assoc array.  construct object
for($i=0;$i<count($mainarray2);$i=$i+1){
  
  //coordinates
  $elem = json_decode($mainarray2[$i]['centroid'], true);
  $cen_lng = ($elem['coordinates'][0]); //lng
  $cen_lat = ($elem['coordinates'][1]); //lat  
  
  //bbox
   $elem = json_decode($mainarray2[$i]['bbox'], true);
  $pt1 = ($elem['coordinates'][0][0][0]); //lleft corner lng
  $pt2 = ($elem['coordinates'][0][0][1]); //lleft corner lat  
  $pt3 = ($elem['coordinates'][0][2][0]); //uright corner lng
  $pt4 = ($elem['coordinates'][0][2][1]); //uright corner lat  
  
  $lgid_lookup = lookup($mainarray2[$i]['city'], $json2);
  
  
for($j=0;$j<count($lgbasic);$j=$j+1){

  if($lgbasic[$j]['LG_ID']==$lgid_lookup){
      $objarray = array(
        'lgid' => $lgid_lookup,
        'fips' => $mainarray2[$i]['city'],
        'lgname' => $lgbasic[$j]['NAME'],
        'lgtype' => $lgbasic[$j]['LGTYPE_ID'],
        'lgstatus' => $lgbasic[$j]['LGSTATUS_ID'],
        'bbox' => $pt1.','.$pt2.','.$pt3.','.$pt4,
        'coordinates' => [$cen_lng, $cen_lat]
      );
    
    array_push($mastershapes, $objarray);
    
  } //end matching lgid

} //end loop through lgbasic file

} //end loop through postgis district result set


//Loop through $c_counties - add to $mastershapes
for($i=0;$i<count($c_counties);$i=$i+1){
  array_push($mastershapes, $c_counties[$i]);
}

$fp = fopen('geopts.json', 'w');
fwrite($fp, json_encode($mastershapes));
fclose($fp);


?>