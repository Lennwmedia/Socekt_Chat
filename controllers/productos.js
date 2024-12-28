const { request, response } = require("express");
const { Producto } = require("../models");

// páginado - total - populate
const obtenerProductos = async(req = request, res = response) => {

    const { limit, desde = 0} = req.query;
    const query = { state: true };
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'name')
        .populate('categoria', 'name')
        .limit(Number(limit))
        .skip(Number(desde))
    ])

    res.json({
        total,
        productos
    })
};

// obtenerProducto - populate {} del producto
const obtenerProducto = async(req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'name').populate('categoria', 'name');

    res.status(200).json(producto)
}

const crearProducto = async(req = request, res = response) => {
    const { state, usuario, ...body } = req.body;

    try {
        const productoDB = await Producto.findOne({ name: body.name });

        if (productoDB) {
            return res.status(400).json({
                msg: `El producto ${productoDB.name} ya existe`
            })
        }

        const data = {
            ...body,
            name: body.name.toUpperCase(),
            usuario: req.usuario._id,
        }

        const producto = new Producto(data);
        await producto.save();

        res.status(201).json(producto)
        
    } catch (error) {
        console.log('error: ', error);
        throw new Error("La validación no pudo pasar");
        
    }
}

// actualizarProducto
const actualizarProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const { state, usuario, ...data } = req.body;

    if ( data.name ) {

        data.name = data.name.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, {new: true} );
    res.json(producto)
}

// borrarCategoria
const borrarProducto = async(req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, {state: false}, {new: true} )

    res.json(producto)
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}