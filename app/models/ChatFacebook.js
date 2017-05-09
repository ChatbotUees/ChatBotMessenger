const request = require('request');
const cliente = require("./Cliente");
const agente = require("./Agente");
const Respuesta = require("./Respuesta"),
      Categoria = require("./Categoria"),
      Servicio = require("./Servicio");

const PAGE_ACCESS_TOKEN = 'EAACJrl8N3tEBAEOalynAsFZASukskMQrrFh3LLPvYXut4AE8Is3WIoz72VGHqZCtQZAKW2ZAuHGw2qwTLMqFliGA0gH76cU5aQZB0Db0gCNFf5nwrZA1zeZAOQtCcnuZCdCIozvmdRUtSSZArOGC2zzr0LnXBbKTMZBwzYJUUOTQPUwAZDZD';


var conectarPaginaFacebook = function conectarPaginaFacebook(req, res) {
    
  try {
    if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'michatbothector081993'){
      console.log('Validacion correcta!');
      res.status(200).send(req.query['hub.challenge']);
    }else{
      console.log('Validacion incorrecta!');
      res.sendStatus(403)
    }
  } catch (e) {      
    res.sendStatus(403)
  }

}

module.exports.conectarPaginaFacebook = conectarPaginaFacebook;


var recibirChat = function recibirChat(req, res) {

  var data = req.body;

  if(data && data.object === 'page'){
    
    //Recorre todas las entradas
    data.entry.forEach(function(entry){
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      //Recorre todos los mensajes
      entry.messaging.forEach(function(event) { console.log("=========================");console.log(event);
        if(event.message){
          recibirMensaje(event);
        }else if(event.postback){
          recibirPostback(event);
        }
      })
    })

    res.sendStatus(200);
  }

}

module.exports.recibirChat = recibirChat;


function recibirMensaje(event) {
    
  var senderID = event.sender.id;    
  var recipientID = event.recipient.id;    
  var timeOfMessage = event.timestamp;    
  var message = event.message;      

  var messageID = message.mid;
  var messageText = message.text;
  var attachments = message.attachments;


  if(messageText) {

    agente.agenteApiAI(messageText, senderID, function(intent, speech) {

      Respuesta.findOne({ intento: intent }).then((respuesta) => {
        console.log(respuesta);
        if(respuesta) {
          
          var elemento = respuesta.elemento;
          var contenido = respuesta.contenido;
          var detalle = respuesta.detalle;

          switch(elemento){
            case "mensaje_texto":
              enviarMensajeTexto(senderID, contenido);
              break;
            case "respuestas_rapidas":
              armaRespuestasRapidas(senderID, contenido, detalle, function(message){                
                enviarRespuestasRapidas(senderID, message);
              });
              break;
            case "plantilla_generica":
              armaPlantillaGenerica(senderID, detalle, function(message){
                enviarPlantillaGenerica(senderID, message);
              });              
              break;
            default :
              enviarMensajeTexto(senderID, "¿Cómo?");
              break;
          }
        }else{
          enviarMensajeTexto(senderID, speech);
        }        
                
      });
      
    });
  }
}

function recibirPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;  
  var payload = event.postback.payload;
    
  if(payload) {

    agente.agenteApiAI(payload, senderID, function(intent, speech) {

      Respuesta.findOne({ intento: intent }).then((respuesta) => {
        console.log(respuesta);
        if(respuesta) {
          
          var elemento = respuesta.elemento;
          var contenido = respuesta.contenido;
          var detalle = respuesta.detalle;

          switch(elemento){
            case "mensaje_texto":
              enviarMensajeTexto(senderID, contenido);
              break;
            case "respuestas_rapidas":
              armaRespuestasRapidas(senderID, contenido, detalle, function(message){                
                enviarRespuestasRapidas(senderID, message);
              });
              break;
            case "plantilla_generica":
              armaPlantillaGenerica(senderID, detalle, function(message){
                enviarPlantillaGenerica(senderID, message);
              });              
              break;
            default :
              enviarMensajeTexto(senderID, "¿Cómo?");
              break;
          }
        }else{
          enviarMensajeTexto(senderID, speech);
        }        
                
      });
      
    });

  }
}


/*=======================================================================================================*/

function armaRespuestasRapidas(recipientId, text, id, callback){
  var result = '';
  
  Categoria.find({id_categoria: id}).exec(function(err, doc){
    
    var data = '{"recipient":{"id": "'+recipientId+'"}, "message": { "text": "'+text+'", "quick_replies": [%DATA%] }}';    

    for(var i in doc) {    
      var item = doc[i];
      var info = '{'+
        '"content_type": "text", '+
        '"title":"' + item.nombre + '", '+
        '"payload":"' + item.nombre +'"'+
      '},';
      result = result + info;      
    }

    result = result.substr(0, (result.length - 1));
    data = data.replace('%DATA%', result);

    callback(JSON.parse(data));
  });
}

function armaPlantillaGenerica(recipientId, id, callback){
  var result = '';
  
  Servicio.find({categoria: id}).exec(function(err, doc){        

    var data = '{'+
    '  "recipient":{'+
    '    "id": "'+recipientId+'"'+
    '  },'+
    '  "message":{'+
    '    "attachment":{'+
    '      "type":"template",'+
    '      "payload":{'+
    '        "template_type": "generic",'+
    '        "elements": [%DATA%]'+
    '      }'+
    '    }'+
    '  }'+
    '}';

    for(var i in doc) {

      var item = doc[i];
      var info="";

      if (item.url.length > 0){
        info ='{'+
          '  "title": "'+item.nombre+'",'+
          '  "subtitle": "",'+
          '  "item_url": "'+item.url+'",'+
          '  "image_url": "'+item.url_imagen+'",'+
          '  "buttons": [{'+
          '    "type": "web_url",'+
          '    "url": "'+item.url+'",'+
          '    "title": "Visitar Página"'+
          '  }, {'+
          '    "type": "postback",'+
          '    "title": "Más Información",'+
          '    "payload": "'+item.nombre+'"'+
          '  }]'+
          '},';
      }else{        
        info ='{'+
          '  "title": "'+item.nombre+'",'+
          '  "subtitle": "",'+
          '  "image_url": "'+item.url_imagen+'",'+
          '  "buttons": [{'+          
          '    "type": "postback",'+
          '    "title": "Más Información",'+
          '    "payload": "'+item.nombre+'"'+
          '  }]'+
          '},';
      }      

      result = result + info;

    }

    result = result.substr(0, (result.length - 1));
    data = data.replace('%DATA%', result);

    callback(JSON.parse(data));
  });
}

/*=======================================================================================================*/


////////////////////////////////////////////// ELEMENTOS DE FACEBOOK ///////////////////////////////////////////////

/******************************** Tipos de Contenidos ********************************/
function enviarMensajeTexto(recipientId, messageText) {

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function enviarAudio(recipientId, urlAudio) {

  var messageData = {
    recipient:{
      id: recipientId
    },
    message:{
      attachment:{
        type: "audio",
        payload:{
          url: urlAudio //"https://petersapparel.com/bin/clip.mp3"
        }
      }
    }
  };

  callSendAPI(messageData);
}

function enviarArchivo(recipientId, urlFile) {

  var messageData = {
    recipient:{
      id: recipientId
    },
    message:{
      attachment:{
        type:"file",
        payload:{
          url: urlFile //"https://petersapparel.com/bin/receipt.pdf"
        }
      }
    }
  };

  callSendAPI(messageData);
}

function enviarImagen(recipientId, urlImage) {

  var messageData = {
    recipient:{
      id: recipientId
    },
    message:{
      attachment:{
        type:"image",
        payload:{
          url: urlImage //"https://petersapparel.com/img/shirt.png"
        }
      }
    }
  };

  callSendAPI(messageData);
}

function enviarVideo(recipientId, urlVideo) {

  var messageData = {
    recipient:{
      id: recipientId
    },
    message:{
      attachment:{
        type:"video",
        payload:{
          url:urlVideo//"https://petersapparel.com/bin/clip.mp4"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/******************************** Plantillas ********************************/

function enviarPlantillaBoton(recipientId, messageText) {

  var messageData = {
    recipient:{
      id: recipientId
    },
    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"button",
          text:"What do you want to do next?",
          buttons:[
            {
              type:"web_url",
              url:"https://petersapparel.parseapp.com",
              title:"Show Website"
            },
            {
              type:"postback",
              title:"Start Chatting",
              payload:"USER_DEFINED_PAYLOAD"
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function enviarPlantillaGenerica(recipientId, messageData) {
  callSendAPI(messageData);
}


/******************************** Respuestas Rapidas ********************************/
function enviarRespuestasRapidas(recipientId, message) {
  callSendAPI(message);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}