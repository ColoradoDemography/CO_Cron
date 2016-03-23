<?php
// Reads file from:
// https://dola.colorado.gov/gis-tmp/limlevy.json

// Loads it to GIS Server
// Database: dola  Schema: bounds  Table: limlevy

// To update table in GIS server, run from anywhere.


//gis server connection string
$host = "host=104.197.26.248";
$port = "port=5433";
$dbname = "dbname=dola";
$credentials = "user=postgres";


$str = file_get_contents('http://dola.colorado.gov/gis-tmp/lginfo.json');

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
  
  echo $value['LG_ID'];

  //enter values in order.  remember the first field needs to be a calculated unique auto-incremented integer.
  
    $sql ="INSERT INTO bounds.lginfo VALUES ('".$incr."', '".$value['LG_ID']."', '".$value['DLGNAME']."', '".$value['ABBREV_NAME']."', '".$value['LGTYPE_ID']."', '".$value['TYPENAME']."', '".$value['TYPE_CATEGORY']."', '".$value['STATUTE']."', '".$value['LGSTATUS_ID']."', '".$value['DESCRIPTION']."', '".$value['URL']."', '".$value['PREV_NAME']."' );";

   $ret = pg_query($db, $sql);
   if(!$ret){
      echo pg_last_error($db);
   } else {
      echo "Record created successfully\n";
   }

}



   pg_close($db);


?>