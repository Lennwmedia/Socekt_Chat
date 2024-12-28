const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token'); 

    if (!token) {
        return res.status(401).json({
            msg: '¡Ingrese un token!'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        // leer usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - no sé encontró en la BD'
            })
        }

        if (!usuario.state) {
            return res.status(401).json({
                msg: 'Token no válido - estado del usuario: false'
            })
        }

        req.usuario = usuario;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
 
    
}


module.exports = {
    validarJWT
}