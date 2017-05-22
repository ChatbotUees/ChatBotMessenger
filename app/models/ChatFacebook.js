const request = require('request');
const cliente = require("./Cliente");
const agente = require("./Agente");
const Respuesta = require("./Respuesta"),
      Categoria = require("./Categoria"),
      Servicio = require("./Servicio");
const path = require('path');
const app = require(path.join(process.cwd(), 'app'));

const PAGE_ACCESS_TOKEN = app.get('settings').access.fb_page_token;
const VERIFY_TOKEN = app.get('settings').access.fb_verify_token;

var conectarPaginaFacebook = function conectarPaginaFacebook(req, res) {
    
  try {
    if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN){
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
      entry.messaging.forEach(function(event) {
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
    respuestasChat(messageText, senderID);
  }

}

function recibirPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;  
  var payload = event.postback.payload;
    
  if(payload) {      
    respuestasChat(payload, senderID);
  }

}

function respuestasChat(message, senderID){

  agente.agenteApiAI(message, senderID, function(intent, speech) {

    Respuesta.find({ intento: intent }, function(err, respuesta) {
      
      console.log(respuesta);
      
        if(respuesta.length > 0) {
          
          for (var i in respuesta) {          

              //sleep(3000); 
              
              var elemento = respuesta[i].elemento;
              var contenido = respuesta[i].contenido;
              var detalle = respuesta[i].detalle;
              var intento = respuesta[i].intento;
              var setTime = respuesta[i].setTimeout;

              switch(elemento){
                case "mensaje_texto":
                  enviarMensajeTexto(senderID, contenido, setTime);                  
                  break;
                case "audio":
                  enviarAudio(senderID, contenido);                  
                  break;
                case "archivo":
                  enviarArchivo(senderID, contenido);                  
                  break;
                case "imagen":
                  enviarImagen(senderID, contenido, setTime);                  
                  break;
                case "video":
                  enviarVideo(senderID, contenido);                  
                  break;
                case "plantilla_boton":
                  enviarPlantillaBoton(senderID, contenido, detalle);                  
                  break;
                case "plantilla_generica":
                  enviarPlantillaGenerica(senderID, detalle);                  
                  break;
                case "respuestas_rapidas":
                  if(intento == 'Default Welcome Intent'){
                    greetUserText(senderID, function(user){
                      contenido = contenido.replace('%USER%', user);
                      enviarRespuestasRapidas(senderID, contenido, detalle, intento);
                    });
                  }else{
                    enviarRespuestasRapidas(senderID, contenido, detalle, intento);
                  }                  
                  break;
                default :
                  enviarMensajeTexto(senderID, "¿Cómo?");                  
                  break;
              }

              //sleep(2000);

          }

        }else{
          enviarMensajeTexto(senderID, speech);
        }      

    }).sort({ _id: -1 });
  
  });

}



////////////////////////////////////////////// ELEMENTOS DE FACEBOOK ///////////////////////////////////////////////

/******************************** Tipos de Contenidos ********************************/
function enviarMensajeTexto(recipientId, messageText, setTime) {

  setTimeout(function(){
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };

    callSendAPI(messageData);  
  }, setTime);
  
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

function enviarImagen(recipientId, urlImage, setTime) {

  setTimeout(function(){
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
  }, setTime);
  console.log("URL %s con time %s", urlImage, setTime);
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
          url: urlVideo//"https://petersapparel.com/bin/clip.mp4"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/******************************** Plantillas ********************************/

function enviarPlantillaBoton(recipientId, text, id) {

  var result = '';

  Categoria.find({id_categoria: id}).exec(function(err, doc){
    
    var messageData = '{'+
      '"recipient":{'+
        '"id": "'+recipientId+'"'+
      '},'+
      '"message":{'+
        '"attachment":{'+
          '"type": "template",'+
          '"payload":{'+
            '"template_type":"button",'+
            '"text":"'+text+'",'+
            '"buttons":[%DATA%]'+
          '}'+
        '}'+
      '}'+
    '}';

    for(var i in doc) {    
      var item = doc[i];
      var info = '{'+
        '"type": "postback", '+
        '"title":"' + item.nombre + '", '+
        '"payload":"' + item.nombre +'"'+
      '},';
      result = result + info;      
    }

    result = result.substr(0, (result.length - 1));
    messageData = messageData.replace('%DATA%', result);
    
    callSendAPI(JSON.parse(messageData));

  });
  
}

function enviarPlantillaGenerica(recipientId, id){
  
  var result = '';
  
  Servicio.find({categoria: id}).exec(function(err, doc){        

    var messageData = '{'+
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
    messageData = messageData.replace('%DATA%', result);
    
    callSendAPI(JSON.parse(messageData));

  });

}

/******************************** Respuestas Rapidas ********************************/
function enviarRespuestasRapidas(recipientId, text, id, intento){
  var result = '';
  
  if (intento == "despedida"){

    var messageData = '{"recipient":{"id": "'+recipientId+'"}, "message": { "text": "'+text+'", "quick_replies": [%DATA%] }}';    
   
    result = '{'+
      '"content_type": "text", '+
      '"title":"Si", '+
      '"payload":"si-servicios"'+
    '},{'+
      '"content_type": "text", '+
      '"title":"No", '+
      '"payload":"no-servicios"'+
    '}';

      messageData = messageData.replace('%DATA%', result);
      
      callSendAPI(JSON.parse(messageData));
      
  }else{

    Categoria.find({id_categoria: id}).exec(function(err, doc){
    
      var messageData = '{"recipient":{"id": "'+recipientId+'"}, "message": { "text": "'+text+'", "quick_replies": [%DATA%] }}';    

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
      messageData = messageData.replace('%DATA%', result);
      
      callSendAPI(JSON.parse(messageData));

    });

  }

}
/**************************************************************************************/

/********************************** API de Envio *************************************/
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

      console.log("Mensaje enviado exitosamente con Id: %s al Id Pagina: %s", messageId, recipientId);
    } else {
      console.error("Error al enviar el mensaje");
      console.error(response);
      console.error(error);
    }
  }); 
  
}
/**************************************************************************************/

function greetUserText(userId, callback) {
  
  request({
    uri: 'https://graph.facebook.com/v2.7/' + userId,
    qs: {
      access_token: PAGE_ACCESS_TOKEN
    }

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var user = JSON.parse(body);

      if (user.first_name) {
        console.log("FB user: %s %s, %s", user.first_name, user.last_name, user.gender);
        callback(user.first_name);
      } else {
        console.log("No se puede obtener datos de fb con user", userId);
      }
      
    } else {
      console.error(response.error);
    }

  });
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}