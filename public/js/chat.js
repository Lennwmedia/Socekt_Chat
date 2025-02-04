
let usuario = null;
let socket = null;

const url = 'http://localhost:8080/api/auth/';

const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No se encontró un token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }

    })

    const { usuario: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem('tokenDB', tokenDB);
    usuario = userDB;
}

const main = async () => {
    await validarJWT();
}

main();

//const socket = io();