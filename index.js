const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Usuario', function(err, res){
    if(err){
        console.log('Error: connecting to Database. '+err);
    }

    app.listen(3000, function(){
        console.log('Node server running on')
    });
});
require('./modelo/usuario');
const usuarioController = require('./controllers/usuarioApp');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

const { config } = require('./config/index');

const usuario = express.Router();

usuario.route('/saveUsuario').post(usuarioController.addUsuario);

app.use(usuario);