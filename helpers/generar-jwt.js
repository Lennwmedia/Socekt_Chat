const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h',
        }, (err, token) => {
            if (err) {
                console.log('error: ', err);
                reject('No se ejecutó la operación')
            } else {
                resolve(token)
            }
        })
    })
}

module.exports = {
    generarJWT
}