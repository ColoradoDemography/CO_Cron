<?php
// Reads file from:
// https://dola.colorado.gov/gis-tmp/lg2cnty.json

// Loads it to GIS Server
// Database: dola  Schema: bounds  Table: lg2cnty

// To update table in GIS server, run from anywhere.


//gis server connection string
$host = "host=104.197.26.248";
$port = "port=5433";
$dbname = "dbname=dola";
$credentials = "user=postgres";

$str = file_get_contents('https://dola.colorado.gov/gis-tmp/lg2cnty.json');

$json = json_decode($str, true); // decode the JSON into an associative array


   $db = pg_connect( "$host $port $dbname $credentials"  );
   if(!$db){
      echo "Error : Unable to open database\n";
   } else {
      echo "Opened database successfully\n";
   }
   
   $sql =<<<EOF
     DROP TABLE IF EXISTS bounds.lg2cnty;
     
     CREATE TABLE bounds.lg2cnty
(  
  ID numeric,       
  LGID CHAR(5),
  COUNTY CHAR(3),
  BEGIN_DATE text,
  END_DATE text,
  CONSTRAINT lg2cnty_pkey PRIMARY KEY (id)       
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bounds.lg2cnty
  OWNER TO postgres;
GRANT ALL ON TABLE bounds.lg2cnty TO postgres;
GRANT SELECT ON TABLE bounds.lg2cnty TO codemog;

CREATE INDEX idx_lg2cnty_lgid ON bounds.lg2cnty USING btree (LGID);
EOF;

   $ret = pg_query($db, $sql);
   if(!$ret){
      echo pg_last_error($db);
   } else {
      echo "Table created successfully\n";
   }

$incr=0;

foreach ($json as $value) {
  
  $incr=$incr+1;
  
  //echo $value['LG_ID'];

  //enter values in order.  remember the first field needs to be a calculated unique auto-incremented integer.

    $sql ="INSERT INTO bounds.lg2cnty VALUES ('".$incr."', '".pg_escape_string($value['LG_ID'])."', '".pg_escape_string($value['COUNTY'])."', '".pg_escape_string($value['BEGIN_DATE'])."', '".pg_escape_string($value['END_DATE'])."' );";

   $ret = pg_query($db, $sql);
   if(!$ret){
      echo pg_last_error($db);
   } else {
      // echo "Record created successfully\n";
   }

}



   pg_close($db);


?>