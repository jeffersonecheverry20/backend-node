'use strict'

const mongoose = require('mongoose');
var Subsidio = mongoose.model('Subsidio');
var ConsultaSubsidio = mongoose.model('consConsultaSubsidioltaSubsidio');
const jwt = require('jsonwebtoken');
const { codigoRetorno, mensajeRetorno, codigoHttp } = require('../constants/constants');

//Crea y actualiza un subsidio
exports.saveSubsidio = (req, res) => {
    //console.log(req.body);
    //console.log(req.token);
    jwt.verify(req.token, 'my_secret_key', async (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {

            var subsidio = new Subsidio({
                fecha: req.body.fecha,
                numero: req.body.numero,
                valor: req.body.valor,
                estudiante: req.body.estudiante
            });

            Subsidio.findOne({ 'estudiante': req.body.estudiante }, (err, subsi) => {

                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                }

                if (subsi !== null && subsi !== 'undefined') {
                    subsidio = subsi;
                    subsidio.fecha = req.body.fecha;
                    subsidio.numero = req.body.numero;
                    subsidio.valor = req.body.valor;
                    subsidio.estudiante = req.body.estudiante;
                }


                subsidio.save((err, subsidio) => {
                    if (err) {
                        return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                    }

                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': subsidio});
                });
            });
        }
    });
};

//Busca todos los subsidios
exports.findAllSubsidios = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            Subsidio.find((err, subsidio) => {
                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                }

                if(subsidio !== null && subsidio !== 'undefined'){
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': subsidio}); //
                }else{
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'No hay subsidios almacenados'});
                }
                
            });
        }
    });
};

//Buscar subsidio por documento del estudiante
exports.findSubsidio = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            Subsidio.findOne({ 'estudiante': req.params.estudiante }, (err, subsidio) => {
                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                } else {
                    //console.log(subsidio);
                    if (subsidio !== 'undefined' && subsidio !== null) {
                        //console.log("Entro a retornar exito");
                        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': subsidio});
                    } else {
                        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': `Subsidio con cédula ${req.params.documento} no encontrado`});
                    }
                }
            });

            var date = new Date();

            var consulta =  new ConsultaSubsidio({
                documento: req.params.estudiante,
                fecha: new Date(date.getFullYear(), date.getMonth()+1, date.getDate())
            });

            consulta.save((err, result) => {
                if(err){
                    console.log("Se presento error al guardar en consulta subsidio ", err.message);
                }

                console.log("Guarda en la tabla consultasubsidio ", result);
            })
            
        }
    });
};

//Elimina subsidio por documento de estudiante
exports.deleteSubsidio = (req, res) => {    
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        }

        Subsidio.findOneAndDelete({ 'estudiante': req.params.estudiante }, (err) => {
            if (err) {
                return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
            }

            res.status(codigoHttp.respuestaExitosa).json({ 'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': 'Subsidio Eliminado' });
        })
    });
};