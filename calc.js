// Defining the IP Address of our server
var express = require('express');
var app = express();
var ipAddress = "127.0.0.1";

// Defining the port on which we want to listen
var portNumber = "52000";

// Importing necessary library files
var httpModule = require("http");

// Creating our server's main method


httpModule.createServer(
 function serviceRequest (request, response) {

  // Check what file the user has requested and take necessary action
  var queryString = new String(request.url);
// console.log(request);
  // We're expecting URLs of the following type:
  // action=add&number1=3&number2=6

  var keyValuePairs = queryString.split("&"); // Splitting the query string based on & delimiter

  // Now keyValuePairs[0] contains our action
  var action = keyValuePairs[0].replace("/","").split("=")[1]; // extracting the action specified in the URL
  var firstNumber = new String(keyValuePairs[1].split("&")).split("=")[1] || "0"; // extracting the first number
  var secondNumber = new String(keyValuePairs[2].split("&")).split("=")[1] || "0"; // extracting the second number

  // calling the method to get the result
  var result = getResult(action.toLowerCase(), Number(firstNumber) , Number(secondNumber));

  // HTML which we will display to the user
  var htmlContent = "<html><b>" + action + "(" + firstNumber + "," + secondNumber + ") = <b>" + result + "</b></html>";

  // write the response
  //console.log(result);
  response.write("result"+result);
  response.end();


 }
).listen(portNumber, ipAddress);

// Utility method to perform an operation on 2 numbers. Helps to modularize code





function getResult(operation, number1, number2)
{
 var result = 0;

 if(operation == "add")
  result = number1 + number2;

 else if(operation == "subtract")
  result = number1 - number2;

 else if(operation == "multiply")
  result = number1 * number2;

 else if(operation == "divide" && number2 != 0)
  result = number1 / number2;

 return result;
}
