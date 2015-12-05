var fs = require('fs');
var nodemailer = require('nodemailer');
var exec = require('child_process').exec;

var child;

var file = "application.log";

var password = fs.readFileSync('mail_pass', 'utf8').trim();
var limit = 15000;

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
			client.set("logCounter", value + 1);
			child = exec(command, function(error, stdout, stderr) {
				if (error != null) {
					console.log("Exec error: " + error);
				}
				fs.unlink(file, function (err) {
					if (err) {
						throw err;
						console.log("Could not delete file");
					}
				});
			});
		});
	}
}, 2000);
