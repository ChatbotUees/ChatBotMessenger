'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Categoria = mongoose.model("Categoria");

let ServicioSchema = new Schema({
    categoria: { type: Schema.ObjectId, ref: "Categoria" },
    nombre: String,
    precio: String,
    descripcion: String,
    estatus: String,
    url_imagen: String,
    url: String,
    telefono: String
});

module.exports = mongoose.model('Servicio', ServicioSchema);
