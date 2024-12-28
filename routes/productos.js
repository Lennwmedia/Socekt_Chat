const { Router, response } = require('express');
const { 
    crearProducto, 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto, 
    borrarProducto} = require('../controllers/productos');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();

// Obtener todos los productos
router.get('/', obtenerProductos);

// Obtener un producto por id 
router.get('/:id',[
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// CrearCategoria - cualquiera con token válido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El id debe ser válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);

// Actualizar producto - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    //check('categoria', 'El id debe ser válido').isMongoId(),
    //check('categoria').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

// Borrar un producto - Admin 
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);


module.exports = router;