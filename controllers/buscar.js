const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesValiadas = [
    'categorias',
    'productos',
    'usuarios',
    'roles',
]

const buscarUsuarios = async(termino = '', res) => {
    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regexp = new RegExp(termino, 'i')

    const usuarios = await Usuario.find({ 
        $or: [{name: regexp}, { email: regexp }],
        $and: [{ state: true }]
     })

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async(termino = '', res) => {
    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {
        const categoria = await Categoria.findById( termino ).populate('usuario', 'name').populate('categoria', 'name');
        
        return res.json({
            results: categoria,
        })
    }

    const regexp = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ name: regexp }, {state: true}).populate('usuario', 'name').populate('categoria', 'name');

    res.json({
        results: categorias
    })
}

const buscarProductos = async(termino = '', res) => {
    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ) {
        const producto = await Producto.findById( termino ).populate('usuario', 'name').populate('categoria', 'name');
        return res.json({
            results: producto
        })
    }

    const regexp = new RegExp( termino, 'i' );

    const productos = await Producto.find({
        $or: [{ name: regexp}],
        $and: [{ disponible: true}, { state: true }]
    }).populate('usuario', 'name').populate('categoria', 'name')

    res.json({
        results: productos
    })
}

const buscar = (req = request, res = response) => {
    const { termino, coleccion } = req.params;

    if (!coleccionesValiadas.includes(coleccion) ) {
        return res.status(400).json({
            msg: `La colección no se encuentra, asegurate que sea: ${coleccionesValiadas}`,
        }) 
            
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        default: 
            res.status(500).json({
                msg: 'Ocurrio un error cuando se ejecutaba la busqueda, hable con le administrador',
            })

    }
}

module.exports = {
    buscar
}