const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        // Verificar si el correo existe 
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto - email',
            })
        }

        // Verificar el estado del usuario
        if ( !usuario.state ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        // Verificar si la contraseña es correcta
        const validPassword = bcryptjs.compareSync( password, usuario.password);

        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - contraseña'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            msg: 'Hable con el Administrador',
        })

    }
}

const googleSignIn = async(req = request, res = response) => {

    const { id_token } = req.body;

    try {

        const { name, img, email } = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({ email });

         if ( !usuario ) {
            // crear usuario
            const data = {
                name,
                email,
                password: ':b',
                img,
                google: true,
                rol: 'USER_ROLE'
            }
 
            usuario = new Usuario( data );
            await usuario.save();
        }

        if ( !usuario.state ) {
            return res.status(401).json({
                msg: 'Hable con el adminsitrador, usuario bloqueado'
            })
        }  

        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'todo bien!',
            usuario,
            token
        }) 

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido',
        })
    }
}

const renovarToken = async(req = request, res = response) => {
    const { usuario } = req;

    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}