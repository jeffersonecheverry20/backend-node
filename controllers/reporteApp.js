'use strict'

const mongoose = require('mongoose');
var Reporte = mongoose.model('Reporte');
const jwt = require('jsonwebtoken');
const { codigoRetorno, mensajeRetorno, codigoHttp } = require('../constants/constants');

//Crea y actualiza un reporte
exports.saveReporte = (req, res) => {
    //console.log(req.body);
    //console.log(req.token);
    jwt.verify(req.token, 'my_secret_key', async (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {

            var reporte = new Reporte({
                fecha: req.body.fecha,
                descripcion: req.body.descripcion,
                subsidio: req.body.subsidio
            });

            Reporte.findOne({ 'subsidio': req.body.subsidio }, (err, report) => {

                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                }

                if (report !== null && report !== 'undefined') {
                    reporte = report;
                    reporte.fecha = req.body.fecha;
                    reporte.descripcion = req.body.descripcion;
                    reporte.subsidio = req.body.subsidio;
                }


                reporte.save((err, reporte) => {
                    if (err) {
                        return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                    }

                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': reporte});
                });
            });
        }
    });
};

//Busca todos los reportes
exports.findAllReportes = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            Reporte.find((err, reporte) => {
                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                }

                if(reporte !== null && reporte !== 'undefined'){
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': reporte});
                }else{
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'No hay reportes almacenados'});
                }
                
            });
        }
    });
};

//Buscar reporte por subsidio
exports.findReporte = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            Reporte.findOne({ 'subsidio': req.params.subsidio }, (err, reporte) => {
                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                } else {
                    //console.log(reporte);
                    if (reporte !== 'undefined' && reporte !== null) {
                        //console.log("Entro a retornar exito");
                        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': reporte});
                    } else {
                        res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': `Reporte con subsidio ${req.params.subsidio} no encontrado`});
                    }
                }
            });
        }
    });
};

//Elimina el reporte por subsidio
exports.deleteReporte = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        }

        Reporte.findOneAndDelete({ 'subsidio': req.params.subsidio }, (err) => {
            if (err) {
                return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
            }

            res.status(codigoHttp.respuestaExitosa).json({ 'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': 'Reporte Eliminado' });
        })
    });
};