/* eslint-disable class-methods-use-this */
const bdServices = require('../services');

class SocketManager {
  launchListener() {
    global.io.on('connection', (socket) => {
      socket.on('login', (userId) => {
        bdServices.updateStatusConected(userId);
      });
      socket.on('logout', (userId) => {
        bdServices.updateStatusDisconected(userId);
      });

      socket.on('disconnect', () => {});
    });
  }

  emitMessage(chatId, returnedConversation) {
    global.io.sockets.emit(chatId, returnedConversation);
  }
}

const socketManager = new SocketManager();

module.exports = socketManager;
