'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var consultaSubsidio =  new Schema({
    documento: {type: String},
    fecha: {type: Date}
});

module.exports = mongoose.model('ConsultaSubsidio', consultaSubsidio);