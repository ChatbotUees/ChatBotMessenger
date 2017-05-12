'use strict';

const path = require('path'); 
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const signature = require('./app/library/verificaFirmaFacebook');
 
var expressConfig = function(app){
  
  //Carga la configuración desde el archivo config.js
  app.set('settings', require('./config'));
  //Exporto la configuración para poder usarla en otras partes
  app.locals.settings = app.get('settings');
 
  //Indico donde están los paquetes de node_modules para que express puede acceder
  app.use('/node_modules', express.static(path.join(process.cwd() + '/node_modules')));
 
  //Verificamos que un request viene de la aplicacion correcta de facebook contrastando con FB_APP_SECRET
  app.use(bodyParser.json({
    verify: signature.verificaFirmaFacebook
  }));

  //For the verbs HTTP get params
  app.use(bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
 
  //Me conecto a la base de datos
  mongoose.connect('mongodb://' + app.get('settings').database.domain + '/' + app.get('settings').database.name);
}
 
module.exports = expressConfig;