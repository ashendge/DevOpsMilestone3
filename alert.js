var http = require('http');
var os = require('os');
var fs = require('fs');
var redis = require('redis');

var client = redis.createClient(6379, '52.34.15.28', {});

var accSID = fs.readFileSync('acc_sid', 'utf8').trim();
var authToken = fs.readFileSync('auth_token', 'utf8').trim();

accSID.slice(0, accSID.length - 1);
authToken.slice(0, authToken.length - 1);

var twiClient = require('twilio')(accSID, authToken);

function memoryLoad()
{
	var total = os.totalmem();
	var load = os.totalmem() - os.freemem();
	var percentage = (load/total)*100;
	return percentage.toFixed(2);
}

function cpuLoadAll () {
	var loads = os.loadavg();
	var percentage = loads[0];
	percentage = percentage * 100;
	return percentage.toFixed(2);;
}

setInterval( function () 
{
	
	//cpuAverage();
	//console.log(os.loadavg());
	var memLoad = memoryLoad();
	var cpuLoad = cpuLoadAll();
	console.log("Memory: ", memLoad);
	console.log("CPU: ", cpuLoad);

	if (memLoad > 70) {
		client.get("memFlag", function(err, value) {
			if (value == 0) {
				twiClient.sendMessage({
			    	body: "ALERT! EXCESS MEMORY USAGE",
			    	to: "+12526218047",
			    	from: "+13343844530"
				}, function(err, message) {
			    	//process.stdout.write(message.sid);
					console.log(err);
					console.log("-----");
				});

				client.set("memFlag", 1);
			} else {
				console.log("ALERT! Excess memory usage. Notified Ops Team.");
			}
		});
		//client.set("proxy_flag", 0);
	} 

	if (cpuLoad > 30) {
		client.get("cpuFlag", function(err, value) {
			console.log("Flag value: ", value);
			if (value == 0) {
				//console.log("CPU Load too much. Sending alert");
				twiClient.sendMessage({
			    	body: "ALERT! EXCESS CPU USAGE",
			    	to: "+12526218047",
			    	from: "+13343844530"
				}, function(err, message) {

				});
				client.set("cpuFlag", 1);
			} else {
				console.log("ALERT! Excess CPU Usage. Notified Ops Team");
			}
		});
		client.set("proxy_flag", 0);
	}

}, 2000);

