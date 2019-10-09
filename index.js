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
    agent.add("Audio Turned On !! Enjoy the music");
  };

  function setSoundOff(agent){
    let obj = {
      intent : "soundOff"
    };
    
    pushData(obj);
    agent.add("Audio turned off !");
  };
  

  function closeFeatureSplash(agent){
    let obj = {
      intent : "closeFeatureSplash"
    };

    pushData(obj);
    agent.add("Feature splash closed !! you can watch it on next game load");
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
      agent.add("Bet level set to "+betLevel);
    }
  };

  function setAutoplay(agent){

    const autoplayRounds  = agent.parameters['autoplay-rounds'], 
          startAutoplay = agent.parameters['start-autoplay'];

    let shouldStartAutoplay = false

    // if (!startAutoplay || !autoplayRounds){
    //   if (!startAutoplay){
    //      agent.add(`Please say start Autoplay`);
    //   }
    //   else if (){
    //     agent.add(`please tell number of Autoplay rounds you want to play or say start Autoplay to play with default value`);
        
    //   }else{
    //     agent.add(`please tell number of Autoplay rounds you want to play and then say Start autoplay`);
    //   }
    // }else if(true){

    // }else{
      
    //   let obj = {
    //     intent : "startAutoplay",
    //     autoplayRounds : autoplayRounds,
    //     startAutoplay : 
    //   };
    //   pushData(obj);
    //   agent.add("How many rounds do you want to play?");

    // }
 
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

