var url = require('url')
	, querystring = require("querystring");


var urlParser = function(str){
	var site = url.parse(str) 
		,	protocol_lib = site.protocol.replace(/\:$/, '');
	if(site.port){
		site.default_port = site.port;
	} else if(protocol_lib == "https") {
		site.default_port = 443;
	} else {
		site.default_port = 80; 
	}
	site.connection_lib = require(protocol_lib);
	return site;
}


get = function(str, headers, cb) {
	console.log(str);
	var site = urlParser(str)
		, path = site.pathname
		, http = site.connection_lib;
		
		console.log(headers);
		
		if(site.query) path += "?" + site.query;
		
		var get_options = {  
		  host: site.host,  
		  port: site.default_port,
		  path: path,
		  method: 'GET'
		};

	var request = http.request(get_options);	

		request.on('response', function(response){
		    var data = '';

		    response.on('data', function(chunk){ 
		        data += chunk; 
		    });
		    response.on('end', function(){
		        cb(data);
		    });
		});
		
		request.end();
};

post = function(str, params, headers, cb) {
  console.log(str);
	var site = urlParser(str)
		, http = site.connection_lib;
	var newOnes = JSON.stringify(params);
			params = JSON.parse(newOnes).json;
		
		var post_options = {  
		  host: site.host,  
		  port: site.default_port,
		  path: site.pathname,  
		  method: 'POST',
		  headers: {
		    'Accept': "application/json",
		    'Content-Type': 'application/json',
		    'Content-Length': params.length
		  }
		};  
		
		var request = http.request(post_options);

		request.on('response', function(response){
		    var data = '';

		    response.on('data', function(chunk){ 
					data += chunk; 
		    });
		    response.on('end', function(){
					cb(data);
		    });
		});
		
		request.write(params);
		
		request.end();
};

module.exports = {get : get, post : post};
