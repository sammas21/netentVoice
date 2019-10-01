var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
var {https} = require('https');
const bodyParser = require("body-parser");

app.use(express.static("public"));

app.use(cors());

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.post("/spin", function(req, res) {
  var speech = "spin";
    // req.body.queryResult &&
    // req.body.queryResult.parameters &&
    // req.body.queryResult.parameters.echoText
    //   ? req.body.queryResult.parameters.echoText
    //   : "Seems like some problem. Speak again.";
  
  var speechResponse = {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: speech
            }
          }
        ]
      }
    }
  };
  pushData(data);

  return res.json({
    payload: speechResponse,
    //data: speechResponse,
    fulfillmentText: speech,
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

app.get('/', function(req, res){
    console.log("sample req")
});

app.get('/new', function(req, res){
  https.get("https://connect-spin.herokuapp.com/msg?data=spin");
  res.send("done");
});

function pushData(data){
    console.log("dis go to this");
    io.emit('chat message', data);
}

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

http.listen(process.env.PORT || 3000);