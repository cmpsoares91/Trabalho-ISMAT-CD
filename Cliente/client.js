//Global variables
console.log("antes decl");
var blockQueue   = new Queue(); //Queue with the posts
var arrayPosts   = new Array();   //postJob Object array
var arrayxpto   = new Array();
var result       = false; 		  //flag for cycle
//variables for use with html
var maxPosts, bSize, objString, bString, found, resolution, hash;
console.log("depois decl");


//postJob object
function postJob(URL, blockNum){
    
    //Define Post request object
    //var requestObject       = {};
    var blockSize = bSize.value;
    var base      = bString.value;
    var objective = objString.value;
    var block     = blockNum;
    //alert(base);    
    console.log(base);
    console.log(URL);
    var result;
      alert(URL);
       $.ajax({url: URL, type: "POST",
		data : {'blockSize': blockSize, 'base': base, 'objective': objective, 'block': block}, 
		success : function(data) {
                        result = jQuery.parseJSON(data);
                        console.log(result);
                        if(result[0]===true){
                                //Solution found, print that, stop cicle.
                                console.log("Solution found...");
                                result = true;
                                //found.textContent = "Solucao encontrada";
                                //resolution.textContent = result.resolution;
                                //hash.textContent = result.hash;
                        }
                        console.log("Not found clearing slave...");
                        arrayPosts[arrayPosts.indexOf(blockNum)] = null;
                },
		error: function(textStatus, errorThrown){
			console.log(textStatus);
			//error occurred print that and add block number to queue...
			console.log(errorThrown);
			arrayPosts[arrayPosts.indexOf(blockNum)] = null;
			blockQueue.enqueue(blockNum);
	    }
	});
}
console.log("depois postJob");

//main function
function main(){
	console.log("entrou");
	//initialize variable so that if some aren't defined it used defaults from config.json
	jsonData = "{\"locations\": [\"http://slave1.quantbull.org/app.php\",\"http://slave2.quantbull.org/app.php\",\"http://slave3.quantbull.org/app.php\",\"http://slave4.quantbull.org/app.php\",\"http://slave5.quantbull.org/app.php\"],\"blockSize\": 1000,\"baseString\": \"Hello prof. Pedro Freire!\",\"objective\": \"0000\"}";
	var config = jQuery.parseJSON(jsonData);
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
	
	//Retrieve arguments
        bString    = document.getElementById("frase");//.value;
	objString  = document.getElementById("object");//.value;
	bSize      = document.getElementById("bloco");//.value;
	
	//output variables
	found      = document.getElementById("encontrou");
	resolution = document.getElementById("resolucao");
	hash       = document.getElementById("hash");
	
	//counting variables
    var a = 0, block = 0;
	
	//Main loop only stops if result is true
    while (result !== true){
		for(a = 0; a < maxPosts; a++){
                    console.log(a);
                    console.log(maxPosts);
			if(arrayPosts[a] === undefined || arrayPosts[a] === null){
				console.log("starting a postjob");
				if (blockQueue.isEmpty()) {				
					arrayxpto [a] = new postJob(config.locations[a], block);
					arrayPosts[a] = block++;
				}
				else {
					arrayxpto [a] = new postJob(config.locations[a], blockQueue.peek());
					arrayPosts[a] = blockQueue.dequeue();
				}
			}	
		}
    }
	
	console.log("main() is finishing, bye!");
}
console.log("depois main");
