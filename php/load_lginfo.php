<?php
// Reads file from:
// https://dola.colorado.gov/gis-tmp/limlevy.json

// Loads it to GIS Server
// Database: dola  Schema: bounds  Table: limlevy

// To update table in GIS server, run from anywhere.


//gis server connection string
$host = "host=gis.dola.colorado.gov";
$port = "port=5433";
$dbname = "dbname=dola";
$credentials = "user=postgres";

//require "/root/pg.php";

$str = file_get_contents('https://storage.googleapis.com/co-publicdata/lginfo.json');

$json = json_decode($str, true); // decode the JSON into an associative array


   $db = pg_connect( "$host $port $dbname $credentials"  );
   if(!$db){
      echo "Error : Unable to open database\n";
   } else {
      echo "Opened database successfully\n";
   }


$sql =<<<EOF
     DROP TABLE IF EXISTS bounds.lginfo;
     
     CREATE TABLE bounds.lginfo
(  
  ID numeric,     
  LG_ID text,
  DLGNAME text,
  ABBREV_NAME text,
  LGTYPE_ID text,
  TYPENAME text,
  TYPE_CATEGORY text,     
  STATUTE text,
  LGSTATUS_ID text,
  DESCRIPTION text,
  URL text,    
  PREV_NAME text, 
  CONSTRAINT lginfo_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bounds.lginfo
  OWNER TO postgres;
GRANT ALL ON TABLE bounds.lginfo TO postgres;
GRANT SELECT ON TABLE bounds.lginfo TO codemog;

CREATE INDEX idx_lginfo_lgid ON bounds.lginfo USING btree (LG_ID);
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


  //enter values in order.  remember the first field needs to be a calculated unique auto-incremented integer.
  
    $sql ="INSERT INTO bounds.lginfo VALUES ('".$incr."', '".pg_escape_string($value['LG_ID'])."', '".pg_escape_string($value['DLGNAME'])."', '".pg_escape_string($value['ABBREV_NAME'])."', '".pg_escape_string($value['LGTYPE_ID'])."', '".pg_escape_string($value['TYPENAME'])."', '".pg_escape_string($value['TYPE_CATEGORY'])."', '".pg_escape_string($value['STATUTE'])."', '".pg_escape_string($value['LGSTATUS_ID'])."', '".pg_escape_string($value['DESCRIPTION'])."', '".pg_escape_string($value['URL'])."', '".pg_escape_string($value['PREV_NAME'])."' );";

   $ret = pg_query($db, $sql);
   if(!$ret){
      echo pg_last_error($db);
   } else {
      //echo "Record created successfully\n";
      //echo $value['LG_ID']." ";
   }

}



   pg_close($db);


?>
