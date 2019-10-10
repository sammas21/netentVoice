var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
var {https} = require('https');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const respText = require("./resptext.json")

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
    let obj = {
      intent : "spin"
    };

    pushData(obj);
    agent.add(getRespText(obj.intent));
  };

  function setSoundOn(agent){
    let obj = {
      intent : "soundOn"
    };
    pushData(obj);
    agent.add(getRespText(obj.intent));
  };

  function setSoundOff(agent){
    let obj = {
      intent : "soundOff"
    };
    
    pushData(obj);
    agent.add(getRespText(obj.intent));
  };
  

  function closeFeatureSplash(agent){
    let obj = {
      intent : "closeFeatureSplash"
    };

    pushData(obj);
    agent.add(getRespText(obj.intent));
  };

  function setBetLevel(agent){
    const betLevel = agent.parameters['betLevel'];

    if(!betLevel){
      agent.add("please Tell bet level value");
      
    }else if (betLevel <=0 || betLevel >=11){
      agent.add("please Tell value between 1  and 10");
    }else{
      let obj = {
        intent : "setBetLevel",
        betLevel: betLevel
      };
  
      pushData(obj);
      agent.add(getRespText(obj.intent)+betLevel);
    }
  };

  function setAutoplay(agent){

    const autoplayRounds  = agent.parameters['autoplayRounds'];
    
    const arrRoundNo = [10,25,50,100,250,500,750,1000];
    
    if(!autoplayRounds){
      agent.add("How many rounds do you want to autoplay?");
      
    }else if (!arrRoundNo.indexOf(autoplayRounds)>=0){
      agent.add("Please tell a valid autoplay count value");
    }else{
      let obj = {
        intent : "setAutoplay",
        autoplayRounds: autoplayRounds
      };
  
      pushData(obj);
      agent.add(getRespText(obj.intent));
    }    
  };

  function stopAutoplay(agent){
    let obj = {
      intent : "stopAutoplay"
    };
    pushData(obj);
    agent.add(getRespText(obj.intent));
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
  intentMap.set('Stop Autoplay', stopAutoplay);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
  
};

//function to send data to game client
function pushData(obj){
    //appRes = "Spin Started !!! Best of luck";
    console.log("dis go to this");
    io.emit('request', obj);
};

//function to send random response to user
function getRespText(intent){
  let respArr = respText[intent],
      res, num;
      num = Math.floor(Math.random()*respArr.length);
  return respArr[num];
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

