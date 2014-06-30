//Global variables
var blockQueue   = new Queue(); //Queue with the posts
var arrayPosts   = new Array();   //postJob Object array
var result       = false; 		  //flag for cycle
var maxPosts, bSize, objString, bString;

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
		data : {"blockSize": requestObject.blockSize, "base": requestObject.base, "objective": requestObject.objective, "block": requestObject.block}, 
		success : 	function(data, textStatus, jqXHR) {
                        result = jQuery.parseJSON(data)
						console.log(tempresult);
						if(result.found){
							//Solution found, print that, stop cicle.
							process.exit(0);
						}
						console.log("Not found clearing slave...");
						arrayPosts[arrayPosts.indexOf(blockNum)] = null;
					},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(textStatus);
			if(textStatus === 'parsererror') {
				//parse error occured, print that...
			}
			else {
				//other error occurred print that and add block number to queue...
				arrayPosts[arrayPosts.indexOf(blockNum)] = null;
				blockQueue.enqueue(blockNum);
			}
	    }
	});
}


//main function
function main(){
	
	//initialize variable so that if some aren't defined it used defaults from config.json
	$.getJSON('./config.json', function(config) {
		//config.locations.length e config.locations[0] devem estar a funcionar agora...
		maxPosts     = config.locations.length; //Maximum number of posts working simultaneously, it depends on the number of hosts
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
	});
	
	//Retrieve arguments
    var bString = document.getElementById("frase");
    var a = 0, block = 0;
	
	//Main loop only stops if result is true
    while (result !== true){
		for(a = 0; a < maxPosts; a++){
			if(arrayPosts[a] == undefined || arrayPosts[a] == null){
				if (blockQueue.isEmpty()) {				
					new postJob(config.locations[a], block);
					arrayPosts[a] = block++;
				}
				else {
					new postJob(config.locations[a], blockQueue.peek());
					arrayPosts[a] = blockQueue.dequeue();
				}
			}	
		}
    }
}
