var fs = require('fs');

var file = "main3000.js";
var stats = fs.statSync(file);

var fSize = stats["size"];
console.log("File size: ", fSize);
