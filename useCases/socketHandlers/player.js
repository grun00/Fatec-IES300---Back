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
    return new Promise( async (resolve, reject) => {
        // Register player information onto the socket
        socketServer.info.onlinePlayers[player.name] = socketServer.socket.id;
        socketServer.socket.name = player.name;
        // Force player to join the General room (for testing)
        try {
            await joinRoom(socketServer, roomName='General');
        } catch (error) {
            console.log(error)
            return reject(error)
        }
        // Alert all users that a new player as joined
        socketServer.io.emit("playerCreated", `${player.name} created.`);
        socketServer.io.emit('getOnlinePlayers', socketServer.info.onlinePlayers);
        return resolve(socketServer.info.onlinePlayers)
    })
    
}

const disconnect = (socketServer) => {
    return new Promise (  async (resolve, reject) =>  {
        try {
            await leaveRoom(socketServer, socketServer.socket.currentRoom, leaveAll=true)
        } catch (error) {
            console.log(error)
            return reject(error)
        }
        delete socketServer.info.onlinePlayers[socketServer.socket.name];
        console.log(`${socketServer.socket.name} has disconnected.`)
        console.log(socketServer.info)
        socketServer.io.emit('getOnlinePlayers', socketServer.info.onlinePlayers)
    })

}


module.exports = {
    getOnlinePlayers,
    newPlayer,
    getServerInfo,
    disconnect
}