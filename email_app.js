var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'devops591@gmail.com',
        pass: 'Pass_12345'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Hey Yo ✔ <devops@gmail.com>', // sender address
    to: 'ashendg@ncsu.edu, shendge.anurag@gmail.com,aneeshkher@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world, this is my first email using Node js ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});