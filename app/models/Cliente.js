'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ClienteSchema = new Schema({
    nombre: String,
    user: String,
    password: String,
    email: String,
    ciudad: String,
    ciudadela: String,
    calle: String,
    telefono: String,
    horario: [{dia: String, horaInicio: String, horaFin: String}]
});

module.exports = mongoose.model('Cliente', ClienteSchema);
