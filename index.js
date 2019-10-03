var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
var cors = require('cors');
const bodyParser = require("body-parser");

var appRes;

//app.use(express.static("public"));

app.use(cors());

app.use(
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
  pushData(speech);

  var speechResponse = {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: appRes
            }
          }
        ]
      }
    }
  };  

  return res.json({
    payload: speechResponse,
    //data: speechResponse,
    fulfillmentText: appRes,
    speech: appRes,
    displayText: appRes,
    source: "connection-video-slot"
  });
});

function pushData(data){
    appRes = "Spin Started !!! Best of luck";
    console.log("dis go to this");
    io.emit('request', data);
}

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});

io.on('connection', function(socket){
    socket.on('request', function(msg){
      console.log('request: ' + msg);
      io.emit('request', msg);
    });

    socket.on('response', function(msg){
      appRes = msg;
    });

});

http.listen(process.env.PORT || 3000);