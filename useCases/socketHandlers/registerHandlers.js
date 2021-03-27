const playerHandler = require("./player")
const roomHandler = require("./rooms")

module.exports= (socketServer) => {
    // Server handlers
    socketServer.socket.on("getServerInfo", () => playerHandler.getServerInfo(socketServer))

    // Player handlers 
    socketServer.socket.on("getOnlinePlayers", () => playerHandler.getOnlinePlayers(socketServer));
    socketServer.socket.on("newPlayer", async player => await playerHandler.newPlayer(socketServer, player));
    socketServer.socket.on("disconnect", async () => await playerHandler.disconnect(socketServer));
    
    // Room handlers
    socketServer.socket.on("createRoom", async roomName => await roomHandler.createRoom(socketServer, roomName));
    socketServer.socket.on("joinRoom", async roomName => await roomHandler.joinRoom(socketServer, roomName));
    socketServer.socket.on("leaveRoom", async roomName=> await roomHandler.leaveRoom(socketServer, roomName));
    socketServer.socket.on("deleteRoom", async roomName=> await roomHandler.deleteRoom(socketServer, roomName));
}