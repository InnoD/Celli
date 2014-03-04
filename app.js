var express = require('express')
var app = express.createServer();
var md = require("node-markdown").Markdown;

// Initialize main server
app.use(express.bodyParser());

app.use(express.public(__dirname + '/static'));

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');


