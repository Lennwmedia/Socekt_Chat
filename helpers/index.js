const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivos = require('./subir-archivos');

module.exports = {
    ...subirArchivos,
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
}