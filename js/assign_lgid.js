
var key_data = require("../json/csbg_key.json");

module.exports = function(entity_name){
  
  for(var i=0; i < key_data.length ; i++){
    
    if(entity_name===key_data[i].agency){
      //console.log('returned match lgid: ' + key_data[i].lgid);
      return key_data[i].lgid;
    }
    
  }//end for i
  
  console.log('no match on: ' + entity_name);
  
}//end exports