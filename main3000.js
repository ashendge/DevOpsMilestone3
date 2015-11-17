function makeServer() {
	var redis = require('redis')
	var multer  = require('multer')
	var express = require('express')
	var fs      = require('fs')
	var app = express()
	// REDIS
	var client = redis.createClient(6379, '52.34.15.28', {})
	
	///////////// WEB ROUTES
	
	// Add hook to make it easier to get all visited URLS.
	app.use(function(req, res, next) 
	{
		var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		client.lpush("sites", fullUrl);
		//console.log(req.method, req.url);
		console.log("Full path: ", fullUrl);
	
		// ... INSERT HERE.
	
		next(); // Passing the request to the next handler in the stack.
	});
	
	app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res) {
	   	if( req.files.image ) {
		   	fs.readFile( req.files.image.path, function (err, data) {
		  		if (err) throw err;
		  		var img = new Buffer(data).toString('base64');
				client.lpush("pictures", img);
				var imgName = req.files.image.originalname;
				console.log("Uploaded image: ",imgName);
				client.lpush("pictureNames", imgName);
			});
		}
	   	res.status(204).end()
	}]);
	
	app.get('/meow', function(req, res) {
		//res.writeHead(200, {'content-type':'image/png'});
		client.lpop("pictures", function(err, value) {
			client.lpop("pictureNames", function(err1, value1) {
				if (value == null) {
					res.write("<h1>No more images. Port 3000</h1>", function(err) {
						res.end();
					});
				} else {
					res.write("<h1>Image of " + value1 + " on port 3000</h1><br>" + 
						"<img src='data:image/png;base64,"+value+"'/>", function(err) {
						res.end();
					});
				}
			});	
		});
	});
	
	
	// HTTP SERVER
	var server = app.listen(3000, function () {
	
	  var host = server.address().address
	  var port = server.address().port
	
	  console.log('Example app listening at http://%s:%s', host, port)
	});
	
	app.get('/', function(req, res) {
		res.send('<h1>Hello on port 3000!</h1>');
	});
	
	app.get('/set', function(req, res) {
		client.set("key", "this message will self destruct in 10 seconds", redis.print);
		client.expire("key", 10);
		res.send("<h1>Message set on port 3000</h1>");
	});
	
	app.get('/get', function(req, res) {
		client.get("key", function(err, value) {
			client.ttl("key", function(err1, value1) {	
				if (value == null) {
					value = "Already expired. Port: 3000";
				} else {
					value = "<b>" + value + "</b>" + ". Time remaining: <b>" + value1 +
						" seconds</b> at port 3000";
				}
				res.send(value);
			});
		});
	});
	
	app.get('/aneesh', function(req, res) {
		var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		var myText = "<h3>You have reached the URL: " + req.url + " on port 3000</h3>";
		res.send(myText);
	});
	
	app.get('/recent', function(req, res) {
		
		client.lrange("sites", 0, 4, function(err, value) {
			var sites = value;
			var a = "<h1>Last 5 visited sites</h1>\n";
			for (var site in value) {
				var num = parseInt(site) + parseInt(1);
				var temp = "<h3>" + parseInt(num).toString() + ". " + 
					value[site].concat("</h3>\n");
				a = a.concat(temp);
			}
			console.log(a);
			res.send("<h3" + a + "</h3>");
		});
	});
	
	app.get('/university', function(req, res) {	
		var myText = "<h3>You have reached the URL: " + req.url + " on port 3000</h3>" +
			"<h4>University: North Carolina State University </h4>";
		res.send(myText);
	});
	
	app.get('/course', function(req, res) {
		var myText = "<h3>You have reached the URL: " + req.url + " on port 3000</h3>" +
			"<h4>Course: DevOps </h4>";
		res.send(myText);
	});
	
	app.get('/state', function(req, res) {
		var myText = "<h3>You have reached the URL: " + req.url + " on port 3000</h3>" +
			"<h4>State: State of North Carolina </h4>";
			res.send(myText);
	});
	return server;
}
makeServer();
module.exports = makeServer;
