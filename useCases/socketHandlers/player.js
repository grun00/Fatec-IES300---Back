const {joinRoom, leaveRoom} = require("./rooms")

const getOnlinePlayers = (socketServer) => {
    socketServer.io.emit('onlinePlayers', socketServer.info.onlinePlayers)
}

const getServerInfo = (socketServer) => {
    socketServer.io.emit("serverInfo", socketServer.info)
    console.log(socketServer.info)
    return socketServer.info
}


const newPlayer = (socketServer, player) => {
        // Register player information onto the socket
        socketServer.info.onlinePlayers[player.name] = socketServer.socket.id;
        socketServer.socket.name = player.name;
        // Force player to join the General room (for testing)
        // Alert all users that a new player as joined
        socketServer.io.emit("playerCreaed", `${player.name} created.`);
        socketServer.io.emit('getOnlinePlayers', socketServer.info.onlinePlayers);
    return socketServer.info.onlinePlayers
}

const disconnect = (socketServer) => {
    return new Promise (  async (resolve, reject) =>  {
        if(!socketServer.info.onlinePlayers[socketServer.socket.name]) return reject("Player doesn't exist")
        try {
            await leaveRoom(socketServer, socketServer.socket.currentRoom, leaveAll=true)
        } catch (error) {
            console.log(error)
            return reject(error)
        }
        delete socketServer.info.onlinePlayers[socketServer.socket.name];
        console.log(`${socketServer.socket.name} has disconnected.`)
        console.log(socketServer.info)
        return resolve(socketServer.io.emit('getOnlinePlayers', socketServer.info.onlinePlayers))
    })

}


module.exports = {
    getOnlinePlayers,
    newPlayer,
    getServerInfo,
    disconnect
}