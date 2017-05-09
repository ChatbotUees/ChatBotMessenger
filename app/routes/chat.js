'use strict';

module.exports = (app, controllers) => {

  new class ChatRoutes {
    
    constructor () {
      var obj = controllers.ChatFacebookController;
      app.get('/', obj.inicio);      
      app.get('/webhook', obj.conectarPaginaFacebook);      
      app.post('/webhook', obj.recibirChat);
    }
    
  }

}