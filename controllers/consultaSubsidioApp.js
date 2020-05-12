'use strict'

const mongoose = require('mongoose');
var ConsultaSubsidio = mongoose.model('ConsultaSubsidio');
const jwt = require('jsonwebtoken');
const { codigoRetorno, mensajeRetorno, codigoHttp } = require('../constants/constants');


exports.findAllConsultaSubsidios = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            ConsultaSubsidio.find((err, subsidio) => {
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
}

exports.findDateSubsidios = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            ConsultaSubsidio.find((err, subsidio) => {
                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                }

                if(subsidio !== null && subsidio !== 'undefined'){
                    
                    var subsidioResult = [];

                    for(var i = 0; i < subsidio.length; i++){
                        var dateInit = req.body.dateInit;
                        var dateFinal = req.body.dateFinal;
                        if(subsidio.fecha.getTime() >= dateInit.getTime() && subsidio.fecha.getTime() <= dateFinal.getTime()){
                            subsidioResult[i] = subsidio;
                        }
                    }
                                        
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': subsidioResult}); //
                }else{
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'No hay subsidios almacenados'});
                }
                
            });
        }
    });
}