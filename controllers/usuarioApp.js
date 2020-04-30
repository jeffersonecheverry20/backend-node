const mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

exports.addUsuario = function(req, res){
    console.log('POST');
    console.log(req.body);

    var usuario = new Usuario({
        email: req.body.email,
        password: req.body.password
    });

    usuario.save(function(err, usuario){
        if(err){
            return res.status(500).send(err.message);
        }

        res.status(200).jsonp(usuario);
    });
}