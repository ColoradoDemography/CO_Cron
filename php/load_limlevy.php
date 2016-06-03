<?php
// Reads file from:
// https://dola.colorado.gov/gis-tmp/limlevy.json

// Loads it to GIS Server
// Database: dola  Schema: bounds  Table: limlevy

// To update table in GIS server, run from anywhere.

//gis.dola.colorado.gov
//gis server connection string
$host = "host=gis.dola.colorado.gov";
$port = "port=5433";
$dbname = "dbname=dola";
$credentials = "user=postgres";

//require "/root/pg.php";

$str = file_get_contents('https://dola.colorado.gov/gis-tmp/limlevy.json');

$json = json_decode($str, true); // decode the JSON into an associative array


   $db = pg_connect( "$host $port $dbname $credentials"  );
   if(!$db){
      echo "Error : Unable to open database\n";
   } else {
      echo "Opened database successfully\n";
   }
   
   $sql =<<<EOF
     DROP TABLE IF EXISTS bounds.limlevy;
     
     CREATE TABLE bounds.limlevy
(  
  ID numeric,     
  LGID CHAR(5),
  SUBDIST_NUM integer,
  BUDGET_YEAR integer,
  COUNTY CHAR(3),
  ASSESSED_VALUE numeric,
  TOTAL_LEVY numeric,
  CONSTRAINT limlevy_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bounds.limlevy
  OWNER TO postgres;
GRANT ALL ON TABLE bounds.limlevy TO postgres;
GRANT SELECT ON TABLE bounds.limlevy TO codemog;

CREATE INDEX idx_limlevy_lgid ON bounds.limlevy USING btree (LGID);
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
  
    $sql ="INSERT INTO bounds.limlevy VALUES ('".$incr."', '".$value['LG_ID']."', '".$value['SUBDIST_NUM']."', '".$value['BUDGET_YEAR']."', '".$value['COUNTY']."', '".$value['ASSESSED_VALUE']."', '".$value['TOTAL_LEVY']."' );";

   $ret = pg_query($db, $sql);
   if(!$ret){
      echo pg_last_error($db);
   } else {
      //echo "Record created successfully\n";
   }

}



   pg_close($db);


?>