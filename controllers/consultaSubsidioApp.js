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
                    
                    const resultado = getListasObjetosFechas(subsidioResult);

                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoExito, 'mensaje': mensajeRetorno.mensajeExito, 'body': resultado});
                }else{
                    res.status(codigoHttp.respuestaExitosa).json({'codigoRetorno': codigoRetorno.codigoFallido, 'mensaje': mensajeRetorno.mensajeFallido, 'body': 'No hay subsidios almacenados'});
                }
                
            });
        }
    });
}

async function getCantidadFechas(subsidioResult) {
    console.log("Entro al metodo getCantidadFechas");
    var fechas = [];
    var contador = 0;
    console.log("El tamaño de subsidio es ",subsidioResult.length);
    for(var i = 0; i < subsidioResult.length; i++) {
        var fecha = subsidioResult[i].fecha;
        console.log("La fecha es "+fecha);
        var fechaString =`${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`;
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

async function getListasFechas(subsidioResult) {  
    console.log("Entro al metodo getListasFechas");
    var fechas = await getCantidadFechas(subsidioResult);
    var data = [];
    var listas = [];
    console.log("El tamaño de fechas es ", fechas.length);
    for(var i = 0; i < fechas.length; i++) {
        console.log("La fecha para obtener la cantidad de fechas es ",fecha[i]);
        data = subsidioResult.filter(element => `${element.getDate()}/${element.getMonth()}/${element.getFullYear()}` == fechas[i]);
        data.forEach(element => console.log("El elemento en el foreach es ", element));
        listas[i] = data;
    }
    console.log("Finalizo el metodo getListasFechas");
    return listas;
}

async function getListasObjetosFechas(subsidioResult) {
    console.log("Entro al metodo getListasObjetosFechas");
    var resultado = [];
    var listas = await getListasFechas(subsidioResult);
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



