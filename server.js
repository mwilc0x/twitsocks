var Twit = require('twit');
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var T = new Twit({
      consumer_key: '',
      consumer_secret: '',
      access_token: '',
      access_token_secret: ''
});

var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/dist'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var searchTerm = '#haiyan';

MongoClient.connect('mongodb://localhost:27017/integration_test', function(err, db) {
    if (err) throw err;
    console.log("Connected to Database");
    
    wss.on('connection', function(ws) {
        var id = setInterval(function() {

          var stream = T.stream('statuses/filter', { track: searchTerm })

          stream.on('tweet', function (tweet) {

              //simple json record
              var document = { name:tweet.user.name, title: tweet.text};

              //insert record
              db.collection('test').insert(document, function(err, records) {
                  if (err) throw err;
                  console.log("Record added as "+records[0]._id);
              });

            ws.send(JSON.stringify(tweet), function() {  });
          });
        }, 5000);

        console.log('websocket connection open');

        ws.on('message', function(data, flags) {
            // flags.binary will be set if a binary data is received
            // flags.masked will be set if the data was masked
            searchTerm = data;
            console.log('Got message ' + data);
        });

        ws.on('close', function() {
            console.log('websocket connection close');
            clearInterval(id);
        });
    });
});
