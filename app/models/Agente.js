const apiai = require('apiai');

var agenteApiAI = function agenteApiAI(messageText, senderID, callback){

  var api = apiai("efdd236562b34121ae04a2c41c27ddea");
  var request = api.textRequest(messageText, { sessionId: senderID });
  var intent, speech;

  request.on('response', function(response) {
    speech = response.result.fulfillment.speech;
    intent = response.result.metadata.intentName;    
    callback(intent, speech);
    console.log("Intento --> "+intent);
    console.log("speech --> "+speech);
  });

  request.on('error', function(error) {  
    console.log(error);
  });

  request.end();
  
}

module.exports.agenteApiAI = agenteApiAI;