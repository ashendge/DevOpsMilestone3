var http = require('http');
var os = require('os');
var fs = require('fs');
var redis = require('redis');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ktdinava@gmail.com',
        pass: 'krishnateja123'
    }
});


var mailOptions = {
	    attachments: [
        {   // utf-8 string as an attachment
            filename: 'email.js',
            path: '/home/krishna/mail/email.js' 
        }],
    from: 'Krishna Teja <ktdinava@gmail.com>', // sender address
    to: 'shendge.anurag@gmail.com', // list of receivers
    subject: 'mail from nodemailer', // Subject line
    text: 'Hello world', // plaintext body
    html: '<img src="http://www.corecls.com/wp-content/uploads/2015/06/alert.png" width:10px height:10px/>' // html body
};


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

	if (memLoad > 90) {
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

	if (cpuLoad > 60) {
			
		transporter.sendMail(mailOptions, function(error, info){
	    if(error){
        	return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);

	});



			//	client.set("cpuFlag", 1);
				
	}

}, 2000);

