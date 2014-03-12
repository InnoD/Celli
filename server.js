var express = require('express'),
  partials = require('express-partials');
var app = express();
var ejs = require('ejs');
var https = require('https');
var http = require('http');
var url = require('url');
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var events;

// sort comparers for date strings
function asorter(a, b) {
  return getTime(a.start_time)-getTime(b.start_time);
}

function dsorter(a, b) {
  return getTime(b.start_time)-getTime(a.start_time);
}

function formatDate(date) {
  var d = date;
  var hh = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var dd = "AM";
  var h = hh;
  if (h >= 12) {
      h = hh-12;
      dd = "PM";
  }
  if (h == 0) {
      h = 12;
  }
  m = m<10?"0"+m:m;
  
  if(m == '00') {
    return h + dd;
  }
  
  s = s<10?"0"+s:s;

  var pattern = new RegExp("0?"+hh+":"+m+":"+s);
  return h+":"+m+dd;
}

function getEvents(){
  https.get({
    host: 'graph.facebook.com',
    path: '/386927114743088/events?access_token=658413130906919|jq0oT6M9dcNBf_a6EGXbpNHrWI4'
  }, function(res){
    var body = "";
    var fully_explored = false;
    res.on('data', function(chunk){
      body += chunk;
    });
    res.on('end', function(){
      if (body == false) {
        return;
      }
      try{
        var ts = (new Date()).valueOf();
        events = {'upcoming': [], 'past': []};
        // while(!fully_explored){
          data = JSON.parse(body);
          paging = data.paging;
          data = data.data;

          var event, date;
          for (var i in data) {
            event = data[i];
            console.log(event.location);
            // More detailed query
            https.get({
              host: 'graph.facebook.com',
              path: '/' + event.id + '?fields=name,cover,description,start_time,id,location&access_token=658413130906919|jq0oT6M9dcNBf_a6EGXbpNHrWI4'
            }, function(res){
              body = "";
              res.on('data', function(chunk){
                body += chunk;
              });
              res.on('end', function(){
                if(body == "false"){
                  return;
                }
                try {
                  event = JSON.parse(body);
                } catch(e) {
                  return;
                }
                date = new Date(event.start_time);
                event.date = months[date.getMonth()] + " " + date.getDate();
                event.dateObj = date;
                event.time = formatDate(date);
                if( event.description != undefined ) {
                  event.description = event.description.replace(/(\r\n|\n|\r)/gm,' ');
                }
                event.pic_url = event.cover.source;
                if(event.dateObj.valueOf() > ts) {
                  events['upcoming'].push(event);
                } else {
                  events['past'].push(event);
                }

                console.log(event);

                // sort events.

              });
            });
          // }
          // if (paging != undefined && paging.next != undefined){
          //   console.log(paging);
          //   https.get(paging.next, function(res){
          //     res.on('data', function(chunk){
          //       body += chunk;
          //     });
          //     res.on('end', function(){
          //       if (body == false) {
          //         return;
          //       }
          //     });
          //   }
          // } else{
          //   console.log('hihi');
          //   fully_explored = true;
          // }
        }
      } catch(e) {
        return;
      }
    });
  });
}

getEvents();

app.use(partials());

// Initialize main server
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/static'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.render('about', {page: 'about'});
});

app.get('/about', function(req, res){
    res.render('about', {page: 'about'});
});

app.get('/events', function(req, res){
    res.render('events', {page: 'events', events: events});
});

app.get('/music', function(req, res){
    res.render('music', {page: 'music'});
});

var port = Number(process.env.PORT || 5000);
app.listen(port);
