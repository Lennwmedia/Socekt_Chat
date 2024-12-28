const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    const { limit, from = 0 } = req.query;
    const query = {state: true};
    
    const [ total, usuarios ]= await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).limit(Number(limit)).skip(Number(from))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async(req, res = response) => {

    const { name, email, password, rol } = req.body;
    const usuario = new Usuario( { name, email, password, rol } );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await usuario.save();

    res.json(usuario)
}

const usuariosPut = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, email, google, ...resto } = req.body;

    // TODO: Validar contra base de datos
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto )

    res.json(usuario)
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controllers'
    })
}

const usuariosDelete = async(req = request, res = response) => {
    
    const { id } = req.params;

    const usuarioAutenticado = req.usuario

    //Elimanar usuario de forma permanente
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {state: false});

    res.json({usuario, usuarioAutenticado})
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}