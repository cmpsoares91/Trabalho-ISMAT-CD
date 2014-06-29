/**
 * Applica��o de Cliente em Node.js
 */
 var $      = require('jquery');
 var config = require('./config.json'); //config.locations.length e config.locations[0] devem estar a funcionar agora...
 var Q  = require('./Queue.js');
 console.log(typeof Q.Queue);
 
 /**
 *  An example HTTP POST request.
 */
//Global variables
//var domains = new Array(); //receive domains from config file;
var postQueue = new Q.Queue(); //Queue with the posts
var maxQueueSize; //Maximum size of queue will depend of the number of hosts
var arrayPosts = new Array(); //postJob Object array

//postJob object
function postJob(baseString, URL, blockNum){
    
    this.result;
    
	var requestObject = {};
	
	requestObject.blockSize = bSize || 1000;
	requestObject.block = blockNum;
	requestObject.baseStr = baseString || "Hello, World!";
	requestObject.objective = objStr || "00000";
	
        var tempresult;
	$.ajax({
		'url': URL,
		'type' : 'POST',
		'headers' : {'Content-Type' : 'application/json'},
		'data' : JSON.stringify(requestObject), 
		'processData' : false,
		'success' : function(data){
                        tempresult = jQuery.parseJSON(data)
			console.log(data);
		},
		'error': function(jqXHR, data){
			console.log(data);
	    },
		'dataType' : 'json'
	});
        this.result = tempresult;
}

//N�o � necess�rio...
//function to get the domains from config.json
/*
function getDomains(){
    var temp;
    var tempSize;
    $.getJSON('config.json', function(response){
       temp = response;
       tempSize = Object.keys(response).length;
    });
    domains = temp;
    maxQueueSize = tempsize;
}
*/

//main function
function main(){
    //local variables
    var arguments = process.argv.slice(2);//receives arguments from command line
    var result = false;
    var a=0;
    var block = 1000;
    getDomains();
    //Main loop only stops if result is true
    while (result !== true){
        //push into the queue the object
        if (postQueue.getLength() <= maxQueueSize ){
            arrayPosts[a] = new postJob(arguments,domains[a],block);
            postQueue.enqueue(arrayPosts[a]);
        }
        //pulls the object from the queue if returns false
        if (arrayPosts[a].result == 'false'){
            postQueue.dequeue(arrayPosts[a]);
        } 
        //if it returns true stops the main loop
        else if (arrayPosts[a].result == 'true'){
            result = true;
        }
        a++;
        block = block+1000;
        if ( a > maxQueueSize){
            a = 0;
        }
        
    }
    
}
