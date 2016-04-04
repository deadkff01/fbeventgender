var express = require('express');
var app = express();
var request = require("request");

var bodyParser = require('body-parser');

app.use(express.static(__dirname+"/public"));
app.use(express.static(__dirname+"/bower_components"));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/getNames', function(req, res) {
	request({
	    url: 'http://localhost:8080/names.min.json',
	    json: true
	}, function (error, response, body) {
	    if (!error && response.statusCode === 200)
	         res.send(body);        
	});
});

app.use(function(req, res) {
  // Use res.sendfile, as it streams instead of reading the file into memory.
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(666);
console.log(__dirname);
console.log('running server at 8000');

