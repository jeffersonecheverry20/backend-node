'use strict'

const mongoose = require('mongoose');
var Subsidio = mongoose.model('Subsidio');
var ConsultaSubsidio = mongoose.model('ConsultaSubsidio');
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
            console.log(date.getFullYear());
            console.log(date.getMonth());
            console.log(date.getDate());

            var consulta =  new ConsultaSubsidio({
                documento: req.params.estudiante,
                fecha: date
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

exports.findAllDateSubsidios = (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err) => {
        if (err) {
            return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
        } else {
            Subsidio.find(async(err, subsidio) => {
                if (err) {
                    return res.send(codigoHttp.fallaCodigo, {'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': err.message});
                }

                if(subsidio !== null && subsidio !== 'undefined'){
                    var subsidiosRealizados= [];
                    var dateInit = new Date(req.body.dateInit);
                    var dateFinal = new Date(req.body.dateFinal);
                    dateInit.setHours(0);
                    dateInit.setMinutes(0);
                    dateInit.setSeconds(0);
                    dateFinal.setHours(23);
                    dateFinal.setMinutes(59);
                    dateFinal.setSeconds(59);
                    var contador  = 0;
                    
                    for(var i = 0; i < subsidio.length; i++){
                            if(subsidio[i].fecha.getTime() >= dateInit.getTime() && subsidio[i].fecha.getTime() <= dateFinal.getTime()){
                                subsidiosRealizados[contador] = subsidio[i];
                                contador++;
                            }
                    }
                    const resultado = await getListasObjetoFechas(subsidiosRealizados);
                    
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': resultado}); //
                }else{
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'No hay subsidios almacenados'});
                }       
            });
        }
    });
}

async function getCantidadFechas(subsidiosRealizados) {
    console.log("Entro al metodo getCantidadFechas");
    var fechas = [];
    var contador = 0;
    console.log("El tamaño de subsidio es ",subsidiosRealizados.length);
    for(var i = 0; i < subsidiosRealizados.length; i++) {
        var fecha = subsidiosRealizados[i].fecha;
        console.log("La fecha es "+fecha);
        var fechaString =`${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        console.log("La fechaString es ",fechaString);
        if(i == 0) {
            console.log("Entro en la posicion 0 y la posicion es ", fechaString);
            fechas[contador] = fechaString;
            contador++;
        } else if(!fechas.includes(fechaString)) {
            console.log("Entro en el metodo includes fecha y la fecha es ",fechaString);
            fechas[contador] = fechaString;
            contador++;
        }
    }
    console.log("Finalizo el metodo getCantidadFechas");
    return fechas;
}

async function getListasFechas(subsidiosRealizados) {  
    console.log("Entro al metodo getListasFechas");
    var fechas = await getCantidadFechas(subsidiosRealizados);
    var data = [];
    var listas = [];
    console.log("El tamaño de fechas es ", fechas.length);
    for(var i = 0; i < fechas.length; i++) {
        console.log("La fecha para obtener la cantidad de fechas es ",fechas[i]);
        data = subsidiosRealizados.filter(element => `${element.fecha.getDate()}/${element.fecha.getMonth() + 1}/${element.fecha.getFullYear()}` == fechas[i]);
        data.forEach(element => console.log("El elemento en el foreach es ", element));
        listas[i] = data.map(element => `${element.fecha.getDate()}/${element.fecha.getMonth() + 1}/${element.fecha.getFullYear()}`);
    }
    console.log("Finalizo el metodo getListasFechas");
    return listas;
}

async function getListasObjetoFechas(subsidiosRealizados) {
    console.log("Entro al metodo getListasObjetosFechas");
    var resultado = [];
    var listas = await getListasFechas(subsidiosRealizados);
    console.log("El tamaño de listas es ",listas.length);
    for(var i = 0; i < listas.length; i++) {
        var lista = listas[i];
        var objeto = {
            fecha: lista[0],
            cantidad: lista.length
        };
        console.log("La fecha del objeto es ", objeto.fecha);
        console.log("La cantidad es ", objeto.cantidad);
        resultado[i] = objeto;
    }

    return resultado;
}

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