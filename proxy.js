var http = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis');

var client = redis.createClient(6379, '52.34.15.28', {}) 

var proxy = httpProxy.createProxyServer({});

var flag = 0;

var server = http.createServer(function(req, res) {
	client.get("proxy_flag", function(err,flag_value){
		if(flag_value == 1) {	
			if (flag < 2) {
				flag++;
				proxy.web(req, res, {target: 'http://52.33.131.62:3000'}, function(err, data) {
					console.log("Fetching request from production");
				});
			} else if (flag == 2) {
				flag = 0;
				proxy.web(req, res, {target: 'http://52.34.95.17:3000'}, function(err, data) {
					console.log("Fetching request from canary");
				});
			}
		} else {
			proxy.web(req, res, {target: 'http://52.33.131.62:3000'}, function(err, data) {
				console.log("Fetching request from production");
			});
		}
	});

});

server.listen(8080);
