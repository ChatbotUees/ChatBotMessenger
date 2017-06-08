'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategoriaSchema = new Schema({
	id_cliente: Schema.ObjectId,
	id_categoria: Schema.ObjectId,
    nombre: String,
    descripcion: String
});

module.exports = mongoose.model('Categoria', CategoriaSchema);
