'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var subsidioSchema = new Schema({
    fecha: {type: Date},
    numero: {type: Number},
    valor: {type: Number},
    estudiante: {type: String}
});

module.exports = mongoose.model('Subsidio', subsidioSchema);