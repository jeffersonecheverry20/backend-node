'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var estudianteSchema = new Schema({
    nombre: {type: String},
    apellido: {type: String},
    documento: {type: String},
    grado: {type: Number},
    barrio: {type: String},
    estrato: {type: Number},
    //correo:{type: String},
    //password:{type: String}
});

module.exports = mongoose.model('Estudiante', estudianteSchema);