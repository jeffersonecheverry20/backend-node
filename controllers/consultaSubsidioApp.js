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
                    var dateInit = new Date(req.body.dateInit);
                    var dateFinal = new Date(req.body.dateFinal);
                    dateInit.setHours(0);
                    dateInit.setMinutes(0);
                    dateInit.setSeconds(0);
                    dateFinal.setHours(23);
                    dateFinal.setMinutes(59);
                    dateFinal.setSeconds(59);
                    var contador  = 0;
                    console.log("La fecha inicio es ", dateInit);
                    console.log("La fecha final es ", dateFinal);
                    
                    for(var i = 0; i < subsidio.length; i++){
                        console.log("En la posicion i el subsidio es ", subsidio[i]);
                        console.log("La fecha es ", subsidio[i].fecha);
                        console.log("El getTime es ", subsidio[i].fecha.getTime());
                        console.log("El gettime Init es ",dateInit.getTime());
                        console.log("El gettime Final es ",dateFinal.getTime());
                        if(subsidio[i].fecha.getTime() >= dateInit.getTime() && subsidio[i].fecha.getTime() <= dateFinal.getTime()){
                            subsidioResult[contador] = subsidio[i];
                            contador++;
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