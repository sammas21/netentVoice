var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');

app.use(express.static("public"));

app.use(cors());

app.get('/', function(req, res){
    res.send("App running");
    res.end();
});

function pushData(data){
    console.log("dis go to this");
    io.emit('chat message', data);
}

app.get('/msg', function(req, res){
    let data = req.query['data'];
    pushData(data);
    console.log(data);
    res.send(data)
    res.end();
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});