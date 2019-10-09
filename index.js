var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
var {https} = require('https');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");

//app.use(express.static("public"));

app.use(cors());

// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
// );

app.use(bodyParser.json());

app.post('/spin', (req, res) =>{
  //console.log("did enter", req);
  processWebhook( req, res )
});

http.listen(process.env.PORT || 3000);

var processWebhook = function( request, response ){

  console.log("-------->");
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function spinStarted(agent){
    pushData("spin");
    agent.add("Best of luck !");
  };

  function setSoundOn(agent){
    pushData("soundOn");
    agent.add("Audio Turned On !! Enjoy the music");
  };

  function setSoundOff(agent){
    pushData("soundOff");
    agent.add("Audio turned off !");
  };
  

  function closeFeatureSplash(agent){
    pushData("closeFeatureSplash");
    agent.add("Feature splash closed !! you can watch it on next game load");
  };

  function setBetLevel(agent){
    pushData("setBetLevel");
    agent.add("Bet level set to 3");
  };

  function setAutoplay(agent){
    pushData("setBetLevel");
    agent.add("How many rounds do you want to play?");
  };

  let intentMap = new Map();
  // intentMap.set('Default Welcome Intent', welcome);
  // intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Spinstart', spinStarted);
  intentMap.set('Set Sound On', setSoundOn);
  intentMap.set('Set Sound Off', setSoundOff);
  intentMap.set('Feature Splash Close', closeFeatureSplash);
  intentMap.set('Set Bet Level', setBetLevel);
  intentMap.set('Set Autoplay', setAutoplay);
  intentMap.set('Start Auto Play', setBetLevel);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
  
};

function pushData(data){
    //appRes = "Spin Started !!! Best of luck";
    console.log("dis go to this");
    io.emit('request', data);
};

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

