const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares/index');

const { 
    esRolValido, 
    emailExiste, 
    usuarioExistePorId } = require('../helpers/db-validators');
    
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosPatch, 
    usuariosDelete } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(usuarioExistePorId),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( emailExiste ),
    check('rol').custom( esRolValido ),
    validarCampos,
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(usuarioExistePorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router