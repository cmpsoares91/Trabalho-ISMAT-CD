/**
 * Applicação de Cliente em Node.js
 */
 var $      = require('jquery');
 var config = require('/config.json');
 
 /**
 *  An example HTTP POST request.
 */  
var postJob = function(URL, blockNum){

	var requestObject = {
		blockSize: bs || 1000;
		block: blockNum,
		baseStr: str || "Hello, World!",
		objective: objStr || "00000"
	};

	$.ajax({
		'url': URL,
		'type' : 'POST',
		'headers' : {'Content-Type' : 'application/json'},
		'data' : JSON.stringify(requestObject), 
		'processData' : false,
		'success' : function(data){
			console.log(data);
		},
		'error': function(jqXHR, data){
			console.log(data);
	    },
		'dataType' : 'json'
	});
};