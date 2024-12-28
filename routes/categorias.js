const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { 
    crearCategorias, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    borrarCategoria } = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/* 
* Utilizando {{url}}/api/productos
*/

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria)

// Crear categoria - privado - cualquiera con token válido
router.post('/',[
    validarJWT,
    check('name', 'No se encontro un nombre').not().isEmpty(),
    validarCampos
], crearCategorias)

// Actualizar categoria - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('name', 'No se encontro un nombre').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria)

// Borrar una categoria - Admin
router.delete('/:id', [     
    validarJWT,
    esAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria)

module.exports = router;