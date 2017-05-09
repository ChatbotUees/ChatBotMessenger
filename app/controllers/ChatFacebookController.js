'use strict'

const chatFacebook = require("../models/ChatFacebook");

class ChatFacebookController {
      
  inicio(req, res) {
    req.send("Hola");
  }
      
  conectarPaginaFacebook(req, res) {    
    chatFacebook.conectarPaginaFacebook(req, res);
  }

  recibirChat(req, res){
     chatFacebook.recibirChat(req, res);    
  } 
    
}

module.exports = new ChatFacebookController;