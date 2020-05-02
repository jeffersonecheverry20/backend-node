'use strict'

const mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
const jwt = require('jsonwebtoken');
const { codigoRetorno, mensajeRetorno, codigoHttp } = require('../constants/constants');

exports.addUsuario = function(req, res){
    //console.log('POST');
    //console.log(req.body);

    var usuario = new Usuario({
        email: req.body.email,
        password: req.body.password
    });

    usuario.save(function(err, usuario){
        if(err){
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        }

        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': usuario});
    });
}

exports.findUsuario = function(req, res){
    console.log(req.body.email);
    Usuario.findOne({'email': req.body.email }, (err, usuario) => {
        if(err){
            res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        }
        //console.log(usuario);
        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': usuario});
    });
};

exports.findAllUsuarios = function(req, res){
    Usuario.find((err, usuario) => {
        if(err){
            res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        }

        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': usuario});
    });
}

exports.loginUsuario = function(req, res){
    Usuario.findOne({'email': req.body.email}, (err, usuario) => {
        if(err){
            res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        }

        if(typeof usuario !== 'undefined' && typeof usuario !== null){
            if(req.body.password === usuario.password){
                const email = usuario.email;
                const token = jwt.sign({email}, 'my_secret_key');
                res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': token});
            }else{
                res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'email y/o password incorrecto'});
            }
        }else{
            res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'usuario no existe en nuestra base de datos'});
        }

        
    });
};