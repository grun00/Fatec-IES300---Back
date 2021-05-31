const {joinRoom, leaveRoom} = require("./rooms")

const getOnlinePlayers = (socketServer) => {
    socketServer.io.emit('onlinePlayers', socketServer.info.onlinePlayers)
}

const getServerInfo = (socketServer) => {
    socketServer.io.emit("serverInfo", socketServer.info)
    return socketServer.info
}


const newPlayer = (socketServer, player) => {
        // Register player information onto the socket
        socketServer.info.onlinePlayers[player.username] = {...player, socketId: socketServer.socket.id};
        socketServer.socket.username = player.username;
        socketServer.socket.player = player;
        // Force player to join the General room (for testing)
        // Alert all users that a new player as joined
        socketServer.io.emit("playerCreated", `${player.username} created.`);
        socketServer.io.emit('getOnlinePlayers', socketServer.info.onlinePlayers);
    return socketServer.info.onlinePlayers
}

const disconnect = (socketServer) => {
        if(!socketServer.info.onlinePlayers[socketServer.socket.username]) {
            console.log("Player doesn't exist")
            return false;
        } 
        try {
            leaveRoom(socketServer, socketServer.socket.currentRoom, leaveAll=true)
        } catch (error) {
            console.log(error)
            return false;
        }
        delete socketServer.info.onlinePlayers[socketServer.socket.username];
        console.log(`${socketServer.socket.username} has disconnected.`)
        socketServer.io.emit('getOnlinePlayers', socketServer.info.onlinePlayers)
        return true;
}


module.exports = {
    getOnlinePlayers,
    newPlayer,
    getServerInfo,
    disconnect
}