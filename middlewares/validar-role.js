const { response, request } = require("express");


const esAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'La operación fallo al acceder a un token'
        })
    }

    const { rol, name } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El ${name} no es administrador - No puede hacer esto`
        })
    }

    next();
}

const tieneRole = ( ...roles ) => {

    return (req = request, res = response, next) => {
        
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'La operación fallo al acceder a un token'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            res.status(401).json({
                msg: `No sé encontró ninguno de los roles: ${ roles }`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole, 
    tieneRole
}