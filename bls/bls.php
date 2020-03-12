<?php


//todo: error catching
require 'counties.php';

$oldstate="08"; //initialize on alabama
$currentstate= array();  //all county fips codes per the current state

for($i=0;$i<count($carray);$i++){  
  //for each element in the imported $carray from counties.php
  
$state =  substr($carray[$i],5,2);  //extract the state fips from the BLS LAUCN id
  
  if($oldstate==$state){  //if the state has not changed
    array_push($currentstate,$carray[$i]);  //push the county id's into the current state array
  }else{
    //if the state fips has changed

    //now, take the array of counties, and divide it into blocks of 50 for API call
    $countymulti=array(); //countymulti is a multidimensional array that stores blocks of up to 50 counties
    $diminc=0; //dimension incrementor for countymulti array
    $counter=0;  //counter within the j 'for' loop below that counts to 50 counties - then resets to 0.
    
    for($j=0;$j<count($currentstate);$j=$j+1){
      if($counter==49){$diminc=$diminc+1;$counter=0;}  //0 to 49 is 50 counties, the limit for a bls api query
      $countymulti[$diminc][$counter]=$currentstate[$j];
      $counter=$counter+1;
    }  //end 'j' loop: aggregating blocks of 50 counties per state
    
    
    //done with a state: code here
    $statemulti = array();  //for each reformatted api result block of 50 county fips, put it into a separate index of the $statemulti array
    echo " !".$diminc."! ";
    for($k=0;$k<=$diminc;$k=$k+1){
      //loop through every multidimensional array index, run the functions below
      
      //two api calls
      $outputset1=callapi($countymulti[$k], "2010", "2020"); //change in February
      $outputset2=callapi($countymulti[$k], "1990", "2009");

      //reorganize data
      $crunch1=crunchdata($outputset1);
      $crunch2=crunchdata($outputset2);

      //use the mergearrays function to combine all years into one php object
      $result1=mergearrays($crunch1, $crunch2);
      
      //put combined arry of all years into state multidimensional array
      $statemulti[$k]=$result1;
      
    }  //end 'k' loop
    
    $exp_array=array();
    //merge together all elements of state array into a single array
    for($m=0;$m<count($statemulti);$m++){
      $exp_array=array_merge($exp_array,$statemulti[$m]);
    }  //end 'm' loop  for each array in $statemulti
    
    echo '  elem in array: '.count($statemulti).'::  ';
    
//create a json folder to hold the data
if(!file_exists('json')){
mkdir("json", 0777, true) or die("cant do it");
}

//write json data to a file by state fips ($oldstate)
$myfile = fopen("json/".$oldstate."_bls.json", "w") or die("Unable to open file!");
fwrite($myfile, json_encode($exp_array));
fclose($myfile);
    
    
    echo "  ns: ".$state;
    //reset, on to the next state
    $oldstate=$state; //reset old state
    $currentstate= array(); //reset currentstate array (collection of all county fips in state)
    $countymulti=array(); //reset multidimensional countyfips array (collection of county fips by blocks of 50)
    
    //we know that the statefips has changed because we have already read the next county fips code
    //we need to take this orphan fips code and push it into $currentstate and start through the loop again
    array_push($currentstate,$carray[$i]);
    
  }  //end else; if state has not changed
      
} //end 'i' loop: for each county fips id

    
exit;
  
  
//call the bls api
function callapi($geo, $startyear, $endyear){
  
$url = 'https://data.bls.gov/publicAPI/v2/timeseries/data/';
        $method = 'POST';
        $query = array(
                'seriesid'  => $geo,
                'startyear' => $startyear,
                'endyear'   => $endyear,
                'registrationKey' => "2e936e05134e4b30978165309104d46b",  //GET YOUR OWN KEY
                'annualaverage' => true
        );
        $pd = json_encode($query);
        $contentType = 'Content-Type: application/json';
        $contentLength = 'Content-Length: ' . strlen($pd);

        $result = file_get_contents(
                $url, null, stream_context_create(
                        array(
                                'http' => array(
                                        'method' => $method,
                                        'header' => $contentType . "\r\n" . $contentLength . "\r\n",
                                        'content' => $pd
                                ),
                        )
                )
        );

$data = json_decode($result, TRUE);
  
  return $data;
}


//create an easy to use object from the api result set
function crunchdata($data){

$alldata = array();

//create the perfect json from bls result set    
for($i=0;$i<count($data['Results']['series']); $i=$i+1){
       $output = array( 
         's' => $data['Results']['series'][$i]['seriesID'],
         'd' => array()
       );
     
       for($j=0; $j<count($data['Results']['series'][$i]['data']);$j=$j+1){
         $tmparray = array(
           'k' => substr($data['Results']['series'][$i]['data'][$j]['periodName'],0,3).($data['Results']['series'][$i]['data'][$j]['year']),
           'v' => $data['Results']['series'][$i]['data'][$j]['value']
         );
         
         array_push($output['d'], $tmparray);
         
         }
  
  array_push($alldata, $output);
     
     }
  
  return $alldata;
  
}

//iterate over arrays, when key matches, merge data, deposit into result array
function mergearrays($array1, $array2){
  
$result = array();

foreach($array1 as $i){
  
  foreach($array2 as $j){
    
    if($i['s']==$j['s']){
       $output = array( 
         's' => $i['s'],
         'd' => array_merge($i['d'],$j['d'])
       );
      
      array_push($result, $output);
      
    } 
  }
}

return $result;
}


?>
