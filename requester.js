var http = require("http")
	, url = require('url')
	, querystring = require("querystring");


get = function(str, headers, cb) {
	console.log(str);
	var site = url.parse(str)
		, connection = http.createClient((site.port || 80), site.hostname)
		, path = site.pathname;
		
		console.log(headers);
		
		if(site.query) path += "?" + site.query;
		var request = connection.request("GET", path, {'host' : site.host})
		

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
	var site = url.parse(str);
	  var newOnes = JSON.stringify(params);
	  params = JSON.parse(newOnes).json;
		
		var post_options = {  
		  host: site.host,  
		  port: 80,
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
