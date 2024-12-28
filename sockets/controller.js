const { Socket } = require("socket.io");

const socketController = (socket = new Socket()) => {
    console.log('Nuevo cliente conectado', socket.id);
}

module.exports = {
    socketController
};