var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var app_2 = express()

var http = require('http')
var httpProxy = require('http-proxy')
var proxy  = httpProxy.createProxyServer()


// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})



app.use(function(req, res, next) 
{

	var visitedSite = (req.originalUrl); //  this should be localhost/

	client.lpush('mylist',visitedSite);
	client.ltrim('mylist',0,4)
	next(); 
	// Passing the request to the next handler in the stack.

});


app.get('/',function(req,res){

	res.send("<h1>Hello World</h1>")

});

app.get('/recent',function(req,res){

		client.lrange('mylist',0,4,function(err,list){


	res.writeHead(200, {'content-type':'text/html'});

		for (var i = 0; i <= list.length - 1; i++) {
			var a = list[i]
			res.write("<h1>http://localhost:"+ a+"</h1>");
		};	
		
		

		res.end()

		//res.send(list);
	});
	
});


/**********************************An EXPIRING CACHE************************************/
app.get('/set',function(req,res){

	var message = "this message will self-destruct in 10 seconds";
	client.set("key",message);
	client.expire('key',10);
	res.send("<h1>Message set</h1>");

});

app.get('/get',function(req,res){

	var val;
	client.get('key',function(err,value){
		val = value;
		if(val != null)
		res.send("<h1>"+val+"</h1>");
	else{
			res.end();
	}
});

});


/**********************************An EXPIRING CACHE************************************/



app.post('/upload',[ multer({ dest: './uploads/'}), function(req,res){

   //console.log(req.body) // form fields
   //console.log(req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	//  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
		//console.log(img);
		client.lpush('ImageList_1',img);
	});

}

   res.status(204).end()
}]);

app.get('/meow', function(req, res) {

		client.lpop('ImageList_1',function(err,imageData){
		res.writeHead(200, {'content-type':'text/html'});
		res.write("<h1>\n<img src='data:image/png;base64,"+imageData+"'/>");
		res.end();
	
	});
		
});

// HTTP SERVER
var server_3;
var server_2;
var server_1;


server_1 = app.listen(3000, function () {

  var host = server_1.address().address
  var port = server_1.address().port
  console.log('Homework app listening at http://localhost%s:%s', host, port)

});


server_2 = app.listen(3001,function(){

	var host = server_2.address().address
	var port = server_2.address().port
	console.log('Second server instance of the homework app listening at http://localhost%s:%s', host, port)

});


//client.rpush(['port_list_1',3000,3001],function(){});
	
var server = http.createServer(function(req, res) {

			//console.log(client);
			//console.log()
			client.rpoplpush('port_list_1','port_list_1',function(err,portVal){

			console.log("Routing through POR # "+portVal);	
			proxy.web(req, res, { target: 'http://localhost:'+ portVal});

		});
	  
});

server.listen(80);