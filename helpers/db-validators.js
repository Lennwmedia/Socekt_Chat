const Role = require('../models/role');
const { Categoria, Producto, Usuario } = require("../models");

const esRolValido =  async(rol = '') => {
        const existeRol = await Role.findOne({ rol });
        if ( !existeRol ) {
            throw new Error(`El rol ${ rol } no está registrado en la BD`);
        }
}

const emailExiste = async( email = '' ) => {
    //Verificar si el correo existe
    const correoValido = await Usuario.findOne({ email });
    if (correoValido) {
        throw new Error(`El correo ${ email } ya está registrado en la BD`);
    }
}

const usuarioExistePorId = async( id ) => {
    //Verificar si el id existe
    const idExiste = await Usuario.findById( id );
    if (!idExiste) {
        throw new Error(`El id ${ id } no es válido - usuario`);
    }
}

const existeCategoriaPorId = async( id = '' ) => {
    const existeIdCategoria = await Categoria.findById(id);

    if ( !existeIdCategoria ) {
        throw new Error(`El id ${id} no sé encontró - categoria`);
    }
}

const existeProductoPorId = async( id = '' ) => {
    const existeIdProducto = await Producto.findById(id);

    if ( !existeIdProducto ) {
        throw new Error(`El id ${id} no sé encontró - producto`);
    }
}

const coleccionValida = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`);   
    }

    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExistePorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionValida
}