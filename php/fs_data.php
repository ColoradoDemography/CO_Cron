<?php
//takes geopts.json  (created by fs_shapes.php)
//matches against oracle view tables (for dola grants) competitive and formulaic (created by get_competitive.php and get_formulaic.php)
//creates sumtotal.geojson: a collection of all districts, munis and counties with grants
//consumed by CO_Grants application

//todo
//dont limit to 20
//rename fields to match CO_Grants
//remove extra fields


//gis server connection string
$host = "host=104.197.26.248";
$port = "port=5433";
$dbname = "dbname=dola";
$credentials = "user=postgres";

$master = []; //master data obj (convert to json and save to file)

//'http://dola.colorado.gov/gis-tmp/geopts.json' or GIS SERVER
$georaw = file_get_contents('geopts.json');
$geopts = json_decode($georaw, true); // decode the JSON into an formulaic associative array

$csbgraw = file_get_contents('csbg_pts.json');
$csbgpts = json_decode($csbgraw, true); 

$keyraw = file_get_contents('csbg_key.json');
$csbgkey = json_decode($keyraw, true); 

for($ii=0;$ii<count($csbgpts);$ii=$ii+1){
  
  array_push($geopts,$csbgpts[$ii]);
  
}


$str = file_get_contents('http://dola.colorado.gov/gis-tmp/competitive.json');
$str2 = file_get_contents('http://dola.colorado.gov/gis-tmp/formulaic.json');

$json = json_decode($str, true); // decode the JSON into an competitive associative array
$json2 = json_decode($str2, true); // decode the JSON into an formulaic associative array



//the competitive associative array has csbg program values that need to be changed
//we have to assign new values using the applicant name (blah) as the key
//also assign service area to csbg
for($jj=0;$jj<count($json);$jj=$jj+1){
  $json[$jj]['SERVED']='';
  
  //if($json[$jj]['PROGRAM_TYPE']=="CSBG"){  //not just for csbg anymore.  finds all records without lgid and assigns one
 
    for($kk=0;$kk<count($csbgkey);$kk=$kk+1){
      if($csbgkey[$kk]['agency']==$json[$jj]['APPLICANT_TITLE']){

        $json[$jj]['LG_ID']=$csbgkey[$kk]['lgid'];
        
   if($json[$jj]['PROGRAM_TYPE']=="CSBG" && isset($csbgkey[$kk]['served'])){   
        $json[$jj]['SERVED']=$csbgkey[$kk]['served'];
   }
      }
    }
    
  //}
  
  
}



//loop through all Geo Points/LGID array
//CHANGE from 20 to count()
for($i=0;$i<count($geopts);$i=$i+1){  //count($geopts);$i=$i+1){
  
  $countofgrants=0;
  
//print_r($geopts[$i]['lgid']." : ");
  //push to these arrays
  $eiaf = [];
  $game = [];
  $redi = [];

  $cdbg = [];
  $cdbgdr =[];
  $csbg = [];

  $ffb = [];
  $sar = [];
  $vfp = [];

  $fmldd = [];
  $fmlddsb106 = [];
  $ctf = [];
  $sevedd = [];

  
//for each element in geopts
  $type = "Feature";
  $geom_type = "Point";
  //geometry: create geometry object

  $geometry = array(
    'type'  => $geom_type,
    'coordinates' => [$geopts[$i]['coordinates'][0], $geopts[$i]['coordinates'][1]]
  );
  

  
//then loop through competitive grants array:
for ($j=0;$j<count($json);$j=$j+1){
  
  //if lgids match
  if($json[$j]['LG_ID']===$geopts[$i]['lgid']){
  
    $countofgrants=$countofgrants+1;
    
    $obj1= array(
    //'PROGRAM_TYPE'  => $json[$j]['PROGRAM_TYPE'],
    'projectnmbr'  => $json[$j]['PROJECT_NMBR'],
    'projname'  => $json[$j]['PROJECT_NAME'],
    //'APPLICANT_TITLE'  => $json[$j]['APPLICANT_TITLE'],
    //'COUNTY'  => $json[$j]['COUNTY'],
    //'EXECUTION_DATE'  => $json[$j]['EXECUTION_DATE'],
    'dateofaward'  => $json[$j]['DATE_OF_AWARD'],
    //'yearofaward'  => $json[$j]['FY_AWARD'],
    'award'  => floatval($json[$j]['AMT_AWARDED']),
    //'AMT_SEVERANCE'  => $json[$j]['AMT_SEVERANCE'],
    //'AMT_MINERAL'  => $json[$j]['AMT_MINERAL'],
    //'REGION_MANAGER'  => $json[$j]['REGION_MANAGER'],
    //'LG_ID'  => $json[$j]['LG_ID'],
    //'PROJECT_TYPE'  => $json[$j]['PROJECT_TYPE'],
    //'DESCRIPTION'  => $json[$j]['PROJECT_DESCRIPTION'],
    //'MATCHING_FUNDS'  => $json[$j]['MATCHING_FUNDS'],
    'served'  => $json[$j]['SERVED']  
    );

    //series of if..then's to decide where to push object
    if($json[$j]['PROGRAM_TYPE']==='REDI'){array_push($redi,$obj1);}
    if($json[$j]['PROGRAM_TYPE']==='EIAF'){array_push($eiaf,$obj1);}
    if($json[$j]['PROGRAM_TYPE']==='CDBG'){array_push($cdbg,$obj1);}
    if($json[$j]['PROGRAM_TYPE']==='DR'){array_push($cdbgdr,$obj1);}    
    if($json[$j]['PROGRAM_TYPE']==='CSBG'){array_push($csbg,$obj1);}   
    if($json[$j]['PROGRAM_TYPE']==='GAME'){array_push($game,$obj1);}        
        
  } //end if lgids match
  
}  //end j (loop through competitive grants array)

  
//then loop through formulaic grants array:
for ($k=0;$k<count($json2);$k=$k+1){

  //CHANGE THIS to if lgids match
  if($json2[$k]['LG_ID']===$geopts[$i]['lgid']){
    
    $countofgrants=$countofgrants+1;
      
    $obj2= array(
    //'PROGRAM_TYPE'  => $json2[$k]['PROGRAM_TYPE'],
    'projname'  => $json2[$k]['PROGRAM_TYPE']." Distribution",
    'projectnmbr'  => null,  
    //'APPLICANT_TITLE'  => $json2[$k]['ENTITY_NAME'],
    //'COUNTY'  => $json2[$k]['COUNTY'],
    //'EXECUTION_DATE'  => $json2[$k]['DIST_DATE'],
    'dateofaward'  => $json2[$k]['DIST_DATE'],
    //'yearofaward'  => $json2[$k]['FISCAL_YEAR'],
    'award'  => floatval($json2[$k]['DIST_AMOUNT']),
    //'LG_ID'  => $json2[$k]['LG_ID']
    );

    //series of if..then's to decide where to push object
    if($json2[$k]['PROGRAM_TYPE']==='SEV_DIST'){array_push($sevedd,$obj2);}
    if($json2[$k]['PROGRAM_TYPE']==='CTF'){array_push($ctf,$obj2);}
    if($json2[$k]['PROGRAM_TYPE']==='FML'){array_push($fmldd,$obj2);}
    if($json2[$k]['PROGRAM_TYPE']==='SAR'){array_push($sar,$obj2);}
    if($json2[$k]['PROGRAM_TYPE']==='FML_SB106'){array_push($fmlddsb106,$obj2);} //CHECK THIS
    if($json2[$k]['PROGRAM_TYPE']==='VFP'){array_push($vfp,$obj2);}
    if($json2[$k]['PROGRAM_TYPE']==='FFB'){array_push($ffb,$obj2);}  
    
    
  } //end if lgids match


}  //end k (loop through formulaic grants array)  

  
  
  
  //create master object
  
  $formula = array(
    'fmldd' => $fmldd,
    'fmlddsb106' => $fmlddsb106,
    'ctf' => $ctf,
    'sevedd' => $sevedd
  );
  
  $special = array(
    'ffb' => $ffb,
    'sar' => $sar,
    'vfp' => $vfp
  );
  
  $federal = array(
    'cdbg' => $cdbg,
    'cdbgdr' => $cdbgdr,
    'csbg' => $csbg
  );
  
  
  $state = array(
    'eiaf' => $eiaf,
    'game' => $game,
    'redi' => $redi
  );
  
  $projects = array(
    'state' => $state,
    'federal' => $federal,
    'special' => $special,
    'formula' => $formula
  );
  
  $properties = array(
    'lgid' => $geopts[$i]['lgid'],
    'lgtype' => $geopts[$i]['lgtype'],
    'lgstatus' => $geopts[$i]['lgstatus'],
    'govname' => $geopts[$i]['lgname'],
    'projects' => $projects
  );
  
  $data_obj = array(
    'type' => "Feature",
    'geometry' => $geometry,
    'properties' => $properties
  );
  
  
  //push to master json object if there were grants
  
  if($countofgrants>0){array_push($master, $data_obj);}
  
} //end i (loop through geopts)


  $container = array(
      'type' => "FeatureCollection",
    'features' => $master
  );


$fp = fopen('sumtotal.geojson', 'w');
fwrite($fp, json_encode($container));
fclose($fp);


?>