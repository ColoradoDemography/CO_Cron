<?php
// Reads file from:
// https://dola.colorado.gov/gis-tmp/lgbasic.json

// Loads it to GIS Server
// Database: dola  Schema: bounds  Table: lgbasic

// To update table in GIS server, run from anywhere.


//gis server connection string
$host = "host=gis.dola.colorado.gov";
$port = "port=5433";
$dbname = "dbname=dola";
$credentials = "user=postgres";

//require "/root/pg.php";

$str = file_get_contents('https://dola.colorado.gov/gis-tmp/lgbasic.json');

$json = json_decode($str, true); // decode the JSON into an associative array


   $db = pg_connect( "$host $port $dbname $credentials"  );
   if(!$db){
      echo "Error : Unable to open database\n";
   } else {
      echo "Opened database successfully\n";
   }
   
   $sql =<<<EOF
     DROP TABLE IF EXISTS bounds.lgbasic;
     
     CREATE TABLE bounds.lgbasic
(  
  ID numeric,       
  LGID CHAR(5),
  LGNAME TEXT,
  LGTYPEID text,
  LGSTATUSID text,
  ABBREV_NAME text,
  MAIL_ADDRESS text,
  ALT_ADDRESS text,
  MAIL_CITY text,
  MAIL_STATE text,
  MAIL_ZIP text,
  URL text,
  PREV_NAME text,
  CONSTRAINT lgbasic_pkey PRIMARY KEY (id)     
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bounds.lgbasic
  OWNER TO postgres;
GRANT ALL ON TABLE bounds.lgbasic TO postgres;
GRANT SELECT ON TABLE bounds.lgbasic TO codemog;

CREATE INDEX idx_lgbasic_lgid ON bounds.lgbasic USING btree (LGID);
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

    $sql ="INSERT INTO bounds.lgbasic VALUES ('".$incr."', '".pg_escape_string($value['LG_ID'])."', '".pg_escape_string($value['NAME'])."', '".pg_escape_string($value['LGTYPE_ID'])."', '".pg_escape_string($value['LGSTATUS_ID'])."', '".pg_escape_string($value['ABBREV_NAME'])."', '".pg_escape_string($value['MAIL_ADDRESS'])."', '".pg_escape_string($value['ALT_ADDRESS'])."', '".pg_escape_string($value['MAIL_CITY'])."', '".pg_escape_string($value['MAIL_STATE'])."', '".pg_escape_string($value['MAIL_ZIP'])."', '".pg_escape_string($value['URL'])."', '".pg_escape_string($value['PREV_NAME'])."' );";

   $ret = pg_query($db, $sql);
   if(!$ret){
      echo pg_last_error($db);
   } else {
      //echo "Record created successfully\n";
   }

}



   pg_close($db);


?>