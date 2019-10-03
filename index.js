var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');
var {https} = require('https');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");

var appRes;

//app.use(express.static("public"));

app.use(cors());

// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
// );

app.use(bodyParser.json());

app.post('/spin', (req, res) =>{
  console.log("did enter", req);
  processWebhook( req, res )});

http.listen(process.env.PORT || 3000);

var processWebhook = function( request, response ){

  console.log("-------->");
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function spinStarted(agent){
    agent.add("thi is it");
  }

  let intentMap = new Map();
  // intentMap.set('Default Welcome Intent', welcome);
  // intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Spinstart', spinStarted);
  intentMap.set('setSound', onSetSound);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
  
}


// app.post("/spin", function(request, response) {

//   const agent = new WebhookClient({ request, response });
//   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
//   console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  

//     // req.body.queryResult &&
//     // req.body.queryResult.parameters &&
//     // req.body.queryResult.parameters.echoText
//     //   ? req.body.queryResult.parameters.echoText
//     //   : "Seems like some problem. Speak again.";

//     function spinStarted(agent){   
//       var speech = "spin";
//       appRes = "spin Started !! Best of luck"
//       pushData(speech);

//       var speechResponse = {
//         google: {
//           expectUserResponse: true,
//           richResponse: {
//             items: [
//               {
//                 simpleResponse: {
//                   textToSpeech: appRes
//                 }
//               }
//             ]
//           }
//         }
//       };
//     }  

//     function onSetSound(agent){   
//       var opt = request.body.queryResult &&
//                     request.body.queryResult.parameters &&
//                     request.body.queryResult.parameters.soundOpt
//                     ? request.body.queryResult.parameters.soundOpt : "Seems like some problem. Speak again.";

//       appRes = "not done";  

//       if (opt == "stop audio"){
//         pushData(opt);
//         appRes = "Audio muted";
//       } else {
//         appRes = "Try Again";
//       }

//       var speechResponse = {
//         google: {
//           expectUserResponse: true,
//           richResponse: {
//             items: [
//               {
//                 simpleResponse: {
//                   textToSpeech: appRes
//                 }
//               }
//             ]
//           }
//         }
//       };
//     }  

//     // function spinStarted(agent){   
//     //   var speech = "spin";
//     //   //let conv = agent.conv(); // Get Actions on Google library conv instance
//     //   //agent.add(`Welcome to my agent!`);
//     //   //https.get("https://connect-spin.herokuapp.com/msg?data=spin");
//     //   pushData(speech);

//     //   var speechResponse = {
//     //     google: {
//     //       expectUserResponse: true,
//     //       richResponse: {
//     //         items: [
//     //           {
//     //             simpleResponse: {
//     //               textToSpeech: appRes
//     //             }
//     //           }
//     //         ]
//     //       }
//     //     }
//     //   };  
//     //   agent.add(appRes);
//     //   // return response.json({
//     //   //   payload: speechResponse,
//     //   //   //data: speechResponse,
//     //   //   fulfillmentText: appRes,
//     //   //   speech: appRes,
//     //   //   displayText: appRes,
//     //   //   source: "connection-video-slot"
//     //   // });
//     // }  
//   //pushData(speech);

//   // var speechResponse = {
//   //   google: {
//   //     expectUserResponse: true,
//   //     richResponse: {
//   //       items: [
//   //         {
//   //           simpleResponse: {
//   //             textToSpeech: appRes
//   //           }
//   //         }
//   //       ]
//   //     }
//   //   }
//   // };  

//   // return response.json({
//   //   payload: speechResponse,
//   //   //data: speechResponse,
//   //   fulfillmentText: appRes,
//   //   speech: appRes,
//   //   displayText: appRes,
//   //   source: "connection-video-slot"
//   // });

//   // Run the proper function handler based on the matched Dialogflow intent name
//   let intentMap = new Map();
//   // intentMap.set('Default Welcome Intent', welcome);
//   // intentMap.set('Default Fallback Intent', fallback);
//   intentMap.set('Spinstart', spinStarted);
//   intentMap.set('setSound', onSetSound);
//   // intentMap.set('your intent name here', googleAssistantHandler);
//   agent.handleRequest(intentMap);

// var speechResponse = {
//     google: {
//       expectUserResponse: true,
//       richResponse: {
//         items: [
//           {
//             simpleResponse: {
//               textToSpeech: appRes
//             }
//           }
//         ]
//       }
//     }
//   };  

//   return response.json({
//     payload: speechResponse,
//     //data: speechResponse,
//     fulfillmentText: appRes,
//     speech: appRes,
//     displayText: appRes,
//     source: "connection-video-slot"
//   });
// });

function pushData(data){
    //appRes = "Spin Started !!! Best of luck";
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

