var express = require('express'),
   partials = require('express-partials');
var app = express();
var ejs = require('ejs');

app.use(partials());

// Initialize main server
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/static'));

app.set('view engine', 'ejs');
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

var port = Number(process.env.PORT || 5000);
app.listen(port);
