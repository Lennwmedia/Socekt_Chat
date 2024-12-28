const { request, response } = require("express");

const { Categoria } = require('../models');

// obtenerCategorias - páginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {
    const { limit, desde = 0 } = req.query; 
    const query = {state: true};
    
    const [ total, categorias ]= await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'name').limit(Number(limit)).skip(Number(desde))
    ])

    res.json({
        total,
        categorias
    })
}

// obtenerCategoria - populate {} de la categoria
const obtenerCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'name');

    res.status(200).json(categoria)
}

// crearCategoria
const crearCategorias = async(req = request, res = response) => {
    
    const name = req.body.name.toUpperCase();

    try {
        const categoriaDB = await Categoria.findOne({ name });

        if ( categoriaDB ) {
            return res.status(400).json({
                msg: `La categoria ${ categoriaDB.name } ya existe`,
            })
        }
    
        // Crear categoria 
        const data = {
            name,
            usuario: req.usuario._id,
        }
    
        const categoria = new Categoria(data)
    
        // Guardar categoria
        await categoria.save();
    
        res.status(201).json(categoria)
    
    } catch (error) {
        console.log(error);
        throw new Error("La validación no pudo pasar");
    }
}

// actualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    // Los valores state y usuarrio no serán manipulados, solo el resto de valores seran actualizados
    const { state, usuario, ...data } = req.body;

    // Capitalizando el nombre de la categoria
    data.name = data.name.toUpperCase();

    // Imprimir el usuario por id
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
    res.json(categoria)
}

// borrarCategoria - estado: false
const borrarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {state: false}, {new: true});

    res.json(categoria)    
}

module.exports = {
    crearCategorias,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}