'use strict'

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { config } = require('./config/index');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jsecheverry:mongodbprueba@cluster0-tdblj.mongodb.net/test?retryWrites=true&w=majority', {useUnifiedTopology: true, useFindAndModify: false}, function(err, res){
    if(err){
        console.log('Error: connecting to Database. '+err);
    }
});
require('./modelo/usuario');
require('./modelo/estudiante');
const usuarioController = require('./controllers/usuarioApp');
const estudianteController = require('./controllers/estudianteApp');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.set('port', config.port);

const usuario = express.Router();

//rutas
usuario.route('/saveUsuario').post(usuarioController.addUsuario);
usuario.route('/findUsuario').post(usuarioController.findUsuario);
usuario.route('/findAllUsuarios').get(usuarioController.findAllUsuarios);
usuario.route('/login').post(usuarioController.loginUsuario);
usuario.route('/saveEstudiante').post(getToken, estudianteController.saveEstudiante);
usuario.route('/findAllEstudiantes').get(getToken, estudianteController.findAllEstudiantes);
usuario.route('/findEstudiante/:documento').get(getToken, estudianteController.findEstudiante);
usuario.route('/deleteEstudiante/:documento').delete(getToken, estudianteController.deleteEstudiante);

app.use(usuario);

function getToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    //console.log(bearerHeader);
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}

server.listen(app.get('port'), () => {
    console.log(`Node server running on ${app.get('port')}`);
});