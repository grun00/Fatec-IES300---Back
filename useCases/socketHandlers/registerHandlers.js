const playerHandler = require("./player")
const roomHandler = require("./rooms")
const matchHandler =  require('./match');

module.exports= (socketServer) => {
    // Server handlers
    socketServer.socket.on("getServerInfo", () => playerHandler.getServerInfo(socketServer))

    // Player handlers 
    socketServer.socket.on("getOnlinePlayers", () => playerHandler.getOnlinePlayers(socketServer));
    socketServer.socket.on("newPlayer", player => playerHandler.newPlayer(socketServer, player));
    socketServer.socket.on("disconnect", () => playerHandler.disconnect(socketServer));
    
    // Room handlers
    socketServer.socket.on("createRoom", async (roomName) => await roomHandler.createRoom(socketServer, roomName));
    socketServer.socket.on("joinRoom", roomName => roomHandler.joinRoom(socketServer, roomName));
    socketServer.socket.on("leaveRoom", roomName=> roomHandler.leaveRoom(socketServer, roomName));
    socketServer.socket.on("deleteRoom", roomName=> roomHandler.deleteRoom(socketServer, roomName));
    socketServer.socket.on("getRoomInfo", () => roomHandler.getRoomInfo(socketServer));

    // Match handlers
    socketServer.socket.on("canWeStart", () => matchHandler.canStart(socketServer));
    socketServer.socket.on("recordAnswer", matchData => matchHandler.recordAnswer(socketServer, matchData))
    socketServer.socket.on("timeUp", data => matchHandler.timeUp(socketServer, data))

}