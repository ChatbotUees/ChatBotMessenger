'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RespuestaSchema = new Schema({
    contenido: String,
    intento: String,
    elemento: String,
    detalle: Schema.ObjectId
});

module.exports = mongoose.model('Respuesta', RespuestaSchema);
