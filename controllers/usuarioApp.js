'use strict'

const mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var Estudiante = mongoose.model('Estudiante');
const jwt = require('jsonwebtoken');
const { codigoRetorno, mensajeRetorno, codigoHttp} = require('../constants/constants');

exports.addUsuario = function(req, res){
    //console.log('POST');
    //console.log(req.body);

    var usuario = new Usuario({
        email: req.body.email,
        password: req.body.password,
        rol: req.body.rol
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

exports.deleteUsuario = function(req, res){
    Usuario.findOneAndDelete({'email': req.params.email}, (err, result) => {
        if(err){
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        }

        res.status(codigoHttp.respuestaExitosa).json({ 'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': 'Usuario Eliminado' });
    });
}

exports.loginUsuario = function(req, res){
    
    const emailRequest = req.body.email;
    const pos1 = emailRequest.indexOf('@');
    const pos2 = emailRequest.indexOf('.');

    const tipoUsuario = email.substring(pos1 + 1, pos2);

    console.log("El email es ", emailRequest);
    console.log("El tipo de usuario es ", tipoUsuario);
    if(tipoUsuario === 'admin'){
        Usuario.findOne({'email': emailRequest}, (err, usuario) => {
            if(err){
                console.log(err);
                res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
            }
    
            if(usuario !== 'undefined' &&  usuario !== null){
                if(req.body.password === usuario.password){
                    const email = usuario.email;
                    const token = jwt.sign({email}, 'my_secret_key', {expiresIn: '5h'});
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': {'token': token, 'rol': 'Administrador'}});
                }else{
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'email y/o password incorrecto'});
                }
            }else{
                res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'el email del usuario no existe en nuestra base de datos'});
            }
    
            
        });
    } else if(tipoUsuario === 'estudiante'){
        Estudiante.findOne({'correo': emailRequest}, (err, estudiante) => {
            if(err){
                console.log(err);
                res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
            }

            if(estudiante !== 'undefined' &&  estudiante !== null){
                if(req.body.password === estudiante.password){
                    const email = estudiante.correo;
                    const token = jwt.sign({email}, 'my_secret_key', {expiresIn: '5h'});
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': {'token': token, 'rol': 'Estudiante'}});
                }else{
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'email y/o password incorrecto'});
                }
            }else{
                res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'el email del usuario no existe en nuestra base de datos'});
            }

        });
    }else{
        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'el dominio del email no corresponde, por favor validarlo'});
    }
    
    
};