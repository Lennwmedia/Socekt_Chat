const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
  const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);

  if (!usuario) {
    socket.disconnect();
  }

  // Agregar el usuario conectado
  chatMensajes.agregarUsuario(usuario);
  io.emit("usuarios-activos", chatMensajes.usuariosArr);
  socket.emit("recibir-mensajes", chatMensajes.ultimos10);

  // Conectar a sala especial
  socket.join(usuario.id);

  // Limpiar cuando alguien se desconecta
  socket.on("disconnect", () => {
    chatMensajes.desconenctarUsuario(usuario.id);
    io.emit("usuarios-activos", chatMensajes.usuariosArr);
  });

  socket.on("recibir-mensaje", ({ uid, mensaje }) => {
    if (uid) {
      // Validar si el usuario que envia el mensaje privado
      socket.to(uid).emit('mensaje-privado', {de: usuario.name, mensaje });
    } else {
      chatMensajes.enviarMensaje(usuario.id, usuario.name, mensaje);
      io.emit("recibir-mensajes", chatMensajes.ultimos10);
    }
  });
};

module.exports = {
  socketController,
};
