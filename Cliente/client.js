/**
 * Client application in Node.js
 */
var http = require('http');
var querystring = require('querystring');
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
var blockQueue   = new Q.Queue(); //Queue with the posts
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
    
	//debug
	console.log("postjob called");

	//Define Post request object
	var requestObject       = {};
	requestObject.blockSize = bSize || 1000;
	requestObject.base      = bString || "Hello, World!";
	requestObject.objective = objString || "00000";
	requestObject.block     = blockNum;
	
	var url = 'http://' + URL + '/app.php';
	var codeString = JSON.stringify(requestObject);
	var result;
	
	//debug
	console.log("body: " + JSON.stringify(requestObject));

	// Build the post string from an object
	var post_data = querystring.stringify(requestObject);
        var postlength = post_data.length;

	// An object of options to indicate where to post to
	var post_options = {
	  host: url,
	  path: '/app.php',
	  method: 'POST',
          headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length' : Buffer.byteLength(postlength)
            }
	};
	
	callback = function (res) {
		res.setEncoding('utf8');
		
		res.on('data', function (chunk) {
		  str += chunk;
		});
		
		res.on('end', function () {
		console.log('Response: ' + str);
		});
	}

	// Set up the request
	var post_req = http.request(post_options, callback);
	  // post the data
	post_req.write(post_data);
	post_req.end();
	
	//temporary
	/*
	var options = {
	  url: url,
	  method: 'POST',
	  body: "requestObject"
	};

	var r = request(options, function (error, response, body) {
		console.log("erro: " + error);
		console.log(response);
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log("Response is: " + response);
			console.log("Error is: " + error);
			
			result = JSON.parse(body);
			console.log(result);
			if(result.found){
				console.log("Problem Solved!");
				console.log("The resolution is: " + result.resolution);
				console.log("The hash result is: " + result.hash);
				process.exit(0);
			}
			console.log("Not found clearing slave...");
			arrayPosts[arrayPosts.indexOf(blockNum)] = null;
		}
		else {
			console.log("Error: " + error);
			console.log("Adding block number to queue...");
			arrayPosts[arrayPosts.indexOf(blockNum)] = null;
			blockQueue.enqueue(blockNum);
		}
	});
	*/

	console.log("Post sent...");
	//console.log(r);
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
			//console.log("Array spot is: " + arrayPosts[a]);
			//console.log("It's on block nr: " + block);
			if(arrayPosts[a] == undefined || arrayPosts[a] == null){
				console.log("Array spot is undefined: " + arrayPosts[a]);
				if (blockQueue.isEmpty()) {
					//debug
					console.log("Queue is empty");
					console.log("Link: " + config.locations[a]);
					console.log("Block: " + block);
				
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
