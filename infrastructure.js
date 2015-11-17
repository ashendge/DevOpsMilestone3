var http      = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;
var request = require("request");

var GREEN = 'http://52.34.49.39:3000';
//var BLUE  = 'http://127.0.0.1:9090';

var TARGET = GREEN;

var infrastructure =
{
  setup: function()
  {
    // Proxy.
    var options = {};
    var proxy   = httpProxy.createProxyServer(options);

    var server  = http.createServer(function(req, res)
    {
      proxy.web( req, res, {target: TARGET } );
    });
    server.listen(8080);

    // Launch green slice
    exec('forever --watch start main3000.js 3000', function(err, out, code) 
    {
      console.log("attempting to launch green slice");
      if (err instanceof Error)
            throw err;
      if( err )
      {
        console.error( err );
      }
    });

    // Launch blue slice
    // exec('forever -w start main.js 3000', function(err, out, code) 
    // {
    //   console.log("attempting to launch green slice");

    //   if (err instanceof Error)
    //     throw err;
    //   if( err )
    //   {
    //     console.error( err );
    //   }
    // });

//setTimeout
//var options = 
//{
//  url: "http://localhost:8080",
//};
//request(options, function (error, res, body) {

  },

  teardown: function()
  {
    exec('forever stopall', function()
    {
      console.log("infrastructure shutdown");
      process.exit();
    });
  },
}

infrastructure.setup();

// Make sure to clean up.
process.on('exit', function(){infrastructure.teardown();} );
process.on('SIGINT', function(){infrastructure.teardown();} );
process.on('uncaughtException', function(err){

console.error(err);
infrastructure.teardown();} );
