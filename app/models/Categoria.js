'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategoriaSchema = new Schema({
    nombre: String,
    descripcion: String
});

module.exports = mongoose.model('Categoria', CategoriaSchema);
