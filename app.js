'use strict';
 
const path = require('path');
 
//Inicializo el servidor express
const express = require('express');
const app = express();
 
//Configuración de la aplicación express
require('./app/config/set-config-express')(app);
 
//Exporto mi instancia de app para utilizarlo en otros archivos
module.exports = app;
 
//Rutas de mi aplicación
require(path.join(process.cwd(), 'app', 'routes'))();
 
//Ejecuto el servidor
app.listen(app.get('settings').port, function() {
  console.log('Listening port: ' + app.get('settings').port);
});