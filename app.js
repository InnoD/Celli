var express = require('express')
var app = express();
var md = require("node-markdown").Markdown;
var markedejs = require('markedejs');
app.engine('.md', markedejs.__express);

// Initialize main server
app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(__dirname + '/static'));

app.set('view engine', 'md');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('home', {page: 'home'});
});

app.get('/events', function(req, res){
    res.render('events', {page: 'events'});
});

app.get('/music', function(req, res){
    res.render('music', {page: 'music'});
});
