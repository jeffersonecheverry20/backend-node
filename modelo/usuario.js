'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    email: {type: String},
    password: {type: String}
});

module.exports = mongoose.model('Usuario', usuarioSchema);