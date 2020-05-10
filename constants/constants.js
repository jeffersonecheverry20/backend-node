'use strict'

const codigoRetorno = {
    codigoExito: 0,
    codigoFallido: 1
};

const mensajeRetorno = {
    mensajeExito: "Exitoso",
    mensajeFallido: "Fallido"
};

const codigoHttp = {
    fallaCodigo: 500,
    respuestaExitosa: 200,
    recursoNoEncontrado: 400
};

const rol = {
    admin: 'Administrador',
    est: 'Estudiante'
}

module.exports = {
    codigoRetorno,
    mensajeRetorno,
    codigoHttp,
    rol
}