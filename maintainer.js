var fs = require('fs');
var nodemailer = require('nodemailer');
var exec = require('child_process').exec;
var redis = require('redis');

var client = redis.createClient(6379, '52.34.15.28', {});

var child;
var file = "application.log";

var password = fs.readFileSync('mail_pass', 'utf8').trim();
var limit = 5000;

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ktdinava@gmail.com',
		pass: password
    }
});


var mailOptions = {
    from: 'DevOps DoNotReply <ktdinava@gmail.com>', // sender address
    to: 'aneeshkher@gmail.com', // list of receivers
    subject: 'mail from nodemailer', // Subject line
    text: 'Hello DevOps', // plaintext body
    html: '<h3>ALERT! <font color="red">File Size Exceeded </font>Usage. ' + 
		'Backing up log file on data store and deleting log file.</h3>'
};

setInterval (function () {
	var stats = fs.statSync(file);
	var fSize = stats["size"];

	if (fSize > limit) {
		transporter.sendMail(mailOptions, function(error, info) {
			if(error) {
				return console.log(error);
			}
		});
		client.get("logCounter", function(err, value) {
			var command = "scp -i Aneesh-Linux-key.pem application.log " +
				"ubuntu@172.31.37.30:/home/ubuntu/application.log." + 
				value.toString();
			client.set("logCounter", (parseInt(value) + 1).toString());
			child = exec(command, function(error, stdout, stderr) {
				if (error != null) {
					console.log("Exec error: " + error);
				}
				fs.unlink(file, function (err) {
					if (err) {
						throw err;
						console.log("Could not delete file");
					}
					
					fs.appendFile(file, "", function(err) {
						console.log("Creating new log file");
					});
				});
			});
		});
	}
}, 2000);
