'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reporteSchema = new Schema ({
    fecha: {type: Date},
    descripcion: {type: String},
    subsidio: {type: Number}
});

module.exports = mongoose.model('Reporte', reporteSchema);