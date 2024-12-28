const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { validarCampos, validarArchivo } = require('../middlewares');
const { coleccionValida } = require('../helpers');

const router = Router()

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'No es un mongo id').isMongoId(),
    check('coleccion').custom(c => coleccionValida(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'No es un mongo id').isMongoId(),
    check('coleccion').custom(c => coleccionValida(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

module.exports = router;