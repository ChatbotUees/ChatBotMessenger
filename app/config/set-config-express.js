'use strict';

const path = require('path'); 
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
//const cookieParser = require('cookie-parser');
//const exphbs = require('express-handlebars');
//const methodOverride = require('method-override');
//const session = require('express-session');
//const MongoStore = require('connect-mongo')(session);
 
var expressConfig = function(app){
  //Carga la configuración desde el archivo config.js
  app.set('settings', require('./config'));
  //Exporto la configuración para poder usarla en otras partes
  app.locals.settings = app.get('settings');
 
  // Configuro handlebars para los templates
  //app.engine('.hbs', exphbs({ layoutsDir: "app/views/layouts", defaultLayout: 'main', extname: '.hbs' }));
  // Seteo donde están las vistas
  //app.set('views', path.join(process.cwd(), 'app', 'views'));
  //app.set('view engine', '.hbs');
 
  //Override with the X-HTTP-Method-Override header in the request
  //app.use(methodOverride('X-HTTP-Method-Override'));
 
  //Cookies
  //app.use(cookieParser());
 
  //Para menejar sessiones
  /*app.use(session({
      secret: 'supernova',
      store: new MongoStore({ url: 'mongodb://' + app.get('settings').database.domain + '/sessions', autoRemove: 'disabled'}),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: (24*3600*1000*30), expires: false}, // 30 Days in ms
  }));*/
 
  //Indico donde estarán los archivos estáticos, en este caso public, para que express puede acceder
  //app.use('/public', express.static(process.cwd() + '/public'));
  //Indico donde están los paquetes de node_modules para que express puede acceder
  app.use('/node_modules', express.static(path.join(process.cwd() + '/node_modules')));
  //Indico donde están los paquetes de bower_components para que express puede acceder
  //app.use('/bower_components', express.static(path.join(process.cwd(), '/bower_components')));
 
  //For the verbs HTTP get params
  app.use(bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
 
  //Me conecto a la base de datos
  mongoose.connect('mongodb://' + app.get('settings').database.domain + '/' + app.get('settings').database.name);
}
 
module.exports = expressConfig;