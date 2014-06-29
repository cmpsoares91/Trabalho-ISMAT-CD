/**
 * Applicação de Cliente em Node.js
 */
 var jsdom  = require('jsdom');
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
var blockQueue    = new Q.Queue(); //Queue with the posts
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
    
	//Define Post request object
	var requestObject       = {};
	requestObject.blockSize = bSize || 1000;
	requestObject.base      = bString || "Hello, World!";
	requestObject.objective = objString || "00000";
	requestObject.block     = blockNum;
	
    var result;
	
	$.ajax({
		type : 'POST',
		url: URL + '/app.php',
		data : JSON.stringify(requestObject), 
		processData : false,
		success : function(data, textStatus, jqXHR) {
                        result = jQuery.parseJSON(data)
						console.log(tempresult);
						if(result.found){
							console.log("Problem Solved!");
							console.log("The resolution is: " + result.resolution);
							console.log("The hash result is: " + result.hash);
							process.exit(0);
						}
						console.log("Not found clearing slave...");
						arrayPosts[arrayPosts.indexOf(blockNum)] = null;
					},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(textStatus);
			if(textStatus === 'parsererror') {
				console.log("There occurred a " + textStatus);
				console.log("Error: " + errorThrown);
				process.exit(1);
			}
			else {
				console.log("There occurred a " + textStatus);
				console.log("Error: " + errorThrown);
				console.log("Adding block number to queue...");
				arrayPosts[arrayPosts.indexOf(blockNum)] = null;
				blockQueue.enqueue(blockNum);
			}
	    }
	});
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
			//debug
			console.log("Array spot is: " + arrayPosts[a]);
			if(arrayPosts[a] === undefined){
				console.log("Array spot is null: " + arrayPosts[a]);
				if (blockQueue.isEmpty()) {
					//debug
					console.log("Queue is empty");
				
					new postJob(config.locations[a], block);
					arrayPosts[a] = block++;
				}
				else {
					//debug
					console.log("Queue is not empty");
					
					new postJob(config.locations[a], blockQueue.peek());
					arrayPosts[a] = blockQueue.dequeue();
				}
			}	
		}
    }
}
