/**
 * Applicação de Cliente em Node.js
 */
 var $      = require('jquery');
 var config = require('./config.json'); //config.locations.length e config.locations[0] devem estar a funcionar agora...
 var Q      = require('./Queue.js');
 
 //Debug
 console.log(typeof Q.Queue);
 console.log(config.locations.length);
 console.log(config.locations[0]);
 console.log(config.blockSize);
 
 /**
 *  An example HTTP POST request.
 */
//Global variables
var postQueue    = new Q.Queue(); //Queue with the posts
var arrayPosts   = new Array();   //postJob Object array

//Load configuration data to variables
var maxPosts = config.locations.length; //Maximum number of posts working simultaneously, it depends on the number of hosts
var bSize, objString, bString;
//bSize load:
try {
	bSize = config.blockSize;
}
catch(err) {
	//Debug:
	console.log("Couldn't load blockSize from config");
	console.log(err);
}
//objString load:
try {
	objString = config.objective;
}
catch(err) {
	//Debug:
	console.log("Couldn't load objective string from config");
	console.log(err);
}
//bString load:
try {
	bString = config.baseString;
}
catch(err) {
	//Debug:
	console.log("Couldn't load base string from config");
	console.log(err);
}

//Run main
main();

//postJob object
function postJob(URL, blockNum){
    
    this.result;
    
	//Define Post request object
	var requestObject       = {};
	requestObject.blockSize = bSize || 1000;
	requestObject.base      = bString || "Hello, World!";
	requestObject.objective = objString || "00000";
	requestObject.block     = blockNum;
	
    var tempresult;
	
	$.ajax({
		'type' : 'POST',
		'url': URL + "/app.php",
		'data' : JSON.stringify(requestObject), 
		'processData' : false,
		'success' : function(data, textStatus, jqXHR) {
                        tempresult = jQuery.parseJSON(data)
						console.log(data);
					},
		'error': function(jqXHR, textStatus, errorThrown){
			console.log(textStatus);
	    }
	});
	
	this.result = tempresult;
}

//main function
function main(){
    //Debug
	console.log("main init");
	
	//local variables
    var args = process.argv.slice(2);//receives arguments from command line
	
	//Debug
	console.log(args);
    
	var result = false;
    var a = 0, block = 0;
	
	//Main loop only stops if result is true
    while (result !== true){
		for(a = 0; a < maxPosts; a++){
			if(arrayPosts[a] === null){
				if (!queue.isEmpty()) {
					new postJob(config.locations[a], block);
					arrayPosts[a] = block++;
				}
				else {
					new postJob(config.locations[a], queue.dequeue());
				}
			}
			
		}
        //push into the queue the object
        if (!queue.isEmpty()){
            arrayPosts[a] = new postJob(config.locations[a], block);
            postQueue.enqueue(arrayPosts[a]);
        }
        //pulls the object from the queue if returns false
        if (arrayPosts[a].result == 'false'){
            postQueue.dequeue(arrayPosts[a]);
			a++;
			block++;
        } 
    }
    
}
