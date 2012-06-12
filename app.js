
/**
 * Module dependencies.
 */

var AppConfig = {};

var express = require('express')
	, app = express.createServer()
	, requester = require('./requester');
	

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Prototype-Version, UserAgent, Content-Type');
    next();
}
	
// Configuration
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
 	app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.cookieParser());
  app.use(express.logger({ format: ':method :url' }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/:proxy_url', function(req, res) {
	requester.get(req.params['proxy_url'], function(resp){
		res.send(resp);
	});
});

if (!module.parent) {	
	var port = process.env.PORT || 4001;
  app.listen(port);
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}
