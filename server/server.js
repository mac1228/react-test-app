var express = require('express');
var path = require("path");

var env = process.env.NODE_ENV;

var app = new express();

app.use(express.static(__dirname + '/../dist/' + env));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/../dist/' + env +'/app.html'));
}).listen(7777);
