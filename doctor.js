var http = require('http');
var os = require('os');
var fs = require('fs');
var redis = require('redis');
var exec = require('child_process').exec;
var nodemailer = require('nodemailer');

var child;
var client = redis.createClient(6379, '52.34.15.28', {});

//var accSID = fs.readFileSync('acc_sid', 'utf8').trim();
//var authToken = fs.readFileSync('auth_token', 'utf8').trim();
var password = fs.readFileSync('mail_pass', 'utf8').trim();

password.slice(0, password.length - 1);

//accSID.slice(0, accSID.length - 1);
//authToken.slice(0, authToken.length - 1);


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ktdinava@gmail.com',
		pass: password
    }
});


var mailOptions = {
	    attachments: [
        {   // utf-8 string as an attachment
            filename: 'email.js',
            path: '/home/aneesh/DevOps/Milestone3/main3000.js' 
        }],
    from: 'DevOps DoNotReply <ktdinava@gmail.com>', // sender address
    to: 'aneeshkher@gmail.com', // list of receivers
    subject: 'mail from nodemailer', // Subject line
    text: 'Hello world', // plaintext body
    html: '<h3>ALERT! <font color="red">Excess CPU </font>Usage. Doctor monkey has been initiated. Please check /home/ubuntu/production/application.log logs for more details</h3>' // html body
};
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

var sendFlag = 1;
setInterval( function () 
{
	
	
	//cpuAverage();
	//console.log(os.loadavg());
	var memLoad = memoryLoad();
	var cpuLoad = cpuLoadAll();
	console.log("Memory: ", memLoad);
	console.log("CPU: ", cpuLoad);

	if (cpuLoad > 40) {
		client.get("cpuFlag", function(err, value) {
			if (value == 0) {
				child = exec("perl fix.pl", function (error, stdout, stderr) {
					if (error != null) {
						console.log("Exec error: " + error);
					}
				});
				transporter.sendMail(mailOptions, function(error, info){
	    			if(error){
        				return console.log(error);
	    			}
				});	
				client.set("cpuFlag", 1);
			} else {
				console.log("Email sent to respective team");
			}
		});
		
	}

}, 2000);

