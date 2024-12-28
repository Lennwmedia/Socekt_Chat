const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { subirArchivos } = require('../helpers');
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {

  try {
    const nombre = await subirArchivos(req.files, undefined, 'imgs');
    res.json({ nombre })

  } catch (msg) {
    res.status(400).json(msg)
  }

}

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No se encontro un usuario con el id ${id}`
        })
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No se encontro un producto con el id ${id}`
        })
      }
      break;
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esa opción' })
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img)

    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg)
    }
  }

  const nombre = await subirArchivos(req.files, undefined, coleccion);
  modelo.img = nombre;
  await modelo.save();
  res.json({ modelo })
}

const mostrarImagen = async(req, res = response) => {
  const  {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No se encontro un usuario con el id ${id}`
        })
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msg: `No se encontro un producto con el id ${id}`
        })
      }
      break;
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esa opción' })
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img)

    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg)
    }
  } 

    const pathImg = path.join( __dirname, '../assets/no-image.jpg' )

    res.sendFile(pathImg)

}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen
}