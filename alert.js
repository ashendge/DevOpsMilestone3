var http = require('http');
var os = require('os');
var nodemailer = require('nodemailer');
var fs = require('fs');

var accSID = fs.readFileSync('acc_sid', 'utf8').trim();
var authToken = fs.readFileSync('auth_token', 'utf8').trim();

accSID.slice(0, accSID.length - 1);
authToken.slice(0, authToken.length - 1);

var twiClient = require('twilio')(accSID, authToken);
console.log(twiClient);

//var transporter = nodemailer.createTransport({
//    service: 'Gmail',
//    auth: {
//        user: 'devops591@gmail.com',
//        pass: passwd
//    }
//});
//
//var mailOptions = {
//    from: '<devops591@gmail.com>', // sender address
//    to: "shendge.anurag@gmail.com," + 
//	"aneeshkher@gmail.com", // list of receivers
//    subject: 'ALERT', // Subject line
//    text: 'You are receiving this email because of an alert on your system',
//    html: '<b>Alert notice</b>' // html body
//};


function memoryLoad()
{
	var total = os.totalmem();
	var load = os.totalmem() - os.freemem();
	var percentage = (load/total)*100;
	return percentage;
}

function getProcessorUsage () {
	var cpus = os.cpus();
	for (var i = 0; i < cpus.length; i++) {
		console.log("CPU Model: ", cpus[i].model);
		var times = cpus[i].times;
		for (var time in cpus[i].times) {
			console.log(time,": ",cpus[i].times[time]/100000);
		}
	}
}

// Create function to get CPU information
function cpuTicksAcrossCores() 
{
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();
 
  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) 
  {
		//Select CPU core
		var cpu = cpus[i];
		//Total up the time in the cores tick
		for(type in cpu.times) 
		{
			totalTick += cpu.times[type];
		}     
		//Total up the idle time of the core
		totalIdle += cpu.times.idle;
  }
 
  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

var startMeasure = cpuTicksAcrossCores();

function cpuAverage()
{
	var endMeasure = cpuTicksAcrossCores(); 
 
	//Calculate the difference in idle and total time between the measures
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;
 
	//Calculate the average percentage CPU usage
	//var percentage = ((totalDifference - idleDifference)/totalDifference) * 100;
	var total = endMeasure.total;
	var idle = endMeasure.idle;

	var percentage = ((total - idle) / total) * 100;
	console.log("Usage: ", percentage);
	return idleDifference;
}

function measureLatenancy(server)
{
	var options = 
	{
		url: 'http://localhost' + ":" + server.address().port,
	};
	request(options, function (error, res, body) 
	{
		server.latency = undefined;
	});

	return server.latency;
}


var flag = 0;
setInterval( function () 
{
	
	//cpuAverage();
	//console.log(os.loadavg());
	var memLoad = memoryLoad();
	if (memLoad > 70) {
		console.log("ALERT! EXCESS MEMORY USAGE", memLoad, "%");
		if (flag == 0) {	
			//transporter.sendMail(mailOptions, function(error, info) {
    		//	if(error) {
        	//		return console.log(error);
    		//	}
    		//		//console.log('Message sent: ' + info.response);

			//});
			twiClient.sendMessage({
			    body: "EXCESS MEMORY USAGE",
			    to: "+12526218047",
			    from: "+13343844530"
			}, function(err, message) {
			    //process.stdout.write(message.sid);
				console.log(err);
				console.log("-----");
				//console.log(message);
			});
			flag = 1;
		}
	}
	//getProcessorUsage();

}, 2000);

