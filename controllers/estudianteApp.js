'use strict'

const mongoose = require('mongoose');
var Estudiante = mongoose.model('Estudiante');
const jwt = require('jsonwebtoken');
const { codigoRetorno, mensajeRetorno, codigoHttp } = require('../constants/constants');

//Crea y actualiza al estudiante
exports.saveEstudiante = (req, res) => {
    //console.log(req.body);
    //console.log(req.token);
    jwt.verify(req.token, 'my_secret_key', async (err, result) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {

            var estudiante = new Estudiante({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                documento: req.body.documento,
                grado: req.body.grado,
                barrio: req.body.barrio,
                estrato: req.body.estrato
            });

            Estudiante.findOne({ 'documento': req.body.documento }, (err, estudian) => {

                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                }

                if (estudian !== null && estudian !== 'undefined') {
                    estudiante = estudian;
                    estudiante.nombre = req.body.nombre;
                    estudiante.grado = req.body.grado;
                    estudiante.barrio = req.body.barrio;
                    estudiante.estrato = req.body.estrato;
                }


                estudiante.save((err, estudiante) => {
                    if (err) {
                        return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                    }

                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': estudiante});
                });
            });
        }
    });
};

//Busca todos los estudiantes
exports.findAllEstudiantes = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err, result) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            Estudiante.find((err, estudiante) => {
                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                }

                if(estudiante !== null && estudiante !== 'undefined'){
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': estudiante});
                }else{
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'No hay estudiantes almacenados'});
                }
                
            });
        }
    });
};

//Busca el estudiante por documento
exports.findEstudiante = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err, result) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            Estudiante.findOne({ 'documento': req.params.documento }, (err, estudiante) => {
                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                } else {
                    //console.log(estudiante);
                    if (estudiante !== 'undefined' && estudiante !== null) {
                        //console.log("Entro a retornar exito");
                        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': estudiante});
                    } else {
                        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': `Estudiante con cédula ${req.params.documento} no encontrado`});
                    }
                }
            });
        }
    });
};

//Elimina el estudiante por documento
exports.deleteEstudiante = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err, result) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        }

        Estudiante.findOneAndDelete({ 'documento': req.params.documento }, (err, resul) => {
            if (err) {
                return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
            }

            res.status(codigoHttp.respuestaExitosa).json({ 'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': 'Usuario Eliminado' });
        })
    });
};