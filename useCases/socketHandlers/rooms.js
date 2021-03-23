
const createRoom =  (socketServer, roomName) => {
    return new Promise(async (resolve, reject) => {
        if(Object.keys(socketServer.info.channels).includes(roomName)) return `${roomName} already exists.`
        socketServer.info.channels[roomName] = [socketServer.socket.name];
        try {
            await joinRoom(socketServer, roomName);
        } catch (error) {
            console.log(error);
            return reject(error);
        }
        socketServer.io.emit("roomCreated", socketServer.info.channels)
        console.log(`Room ${roomName} created`, socketServer.info.channels);
        return resolve(socketServer.info.channels);
    })
}

const leaveRoom = (socketServer, roomName, leaveAll=false) => {
    return new Promise( async (resolve, reject) => {
        if(!Object.keys(socketServer.info.channels).includes(roomName)) return reject(`${roomName} doesn't exist.`);
        if(!socketServer.info.channels[roomName].includes(socketServer.socket.name)) {
            console.log(`Player ${socketServer.socket.info} not in ${roomName}`, socketServer.info.channels);
            return reject(`${socketServer.socket.name} is not in ${roomName}.`);    
        }
        socketServer.info.channels[roomName] = socketServer.info.channels[roomName].filter(item => item !== socketServer.socket.name);
        if(!leaveAll) {
            try {
                console.log("leaveAll", leaveAll)
                console.log("currentRoom", socketServer.socket.currentRoom)
                await joinRoom(socketServer, 'General')
            } catch (error) {
                console.log(error);
                return reject(error);
            }
        }
        socketServer.socket.emit('leftRoom', socketServer.info.channels);
        console.log(`${socketServer.socket.name} has left ${roomName}`);
        console.log("LeftRoom", socketServer.info.channels)
    return resolve(socketServer.info.channels);    
    }
    )
    
}

const joinRoom = (socketServer, roomName) => {
    return new Promise(async (resolve, reject) => {
        if (!Object.keys(socketServer.info.channels).includes(roomName)) return  reject(`${roomName} doesn't exist.`)
        if (socketServer.socket.currentRoom) {
            try {
                await leaveRoom(socketServer, socketServer.socket.currentRoom);
            } catch (error) {
                console.log(error)
                return reject(error)
            }
        }
        socketServer.socket.join(roomName);
        socketServer.info.channels[roomName].push(socketServer.socket.name);
        socketServer.socket.currentRoom = roomName 
        socketServer.socket.emit("joinedRoom", socketServer.info.channels);
        console.log(`${socketServer.socket.name} joined ${roomName}`);
        return resolve(socketServer.info.channels);
    })
}

const deleteRoom = (socketServer, roomName) => {
    return new Promise (async (resolve, reject) => {
        if(!Object.keys(socketServer.info.channels).includes(roomName)) return reject(`${roomName} doesn't exist.`);
        delete socketServer.info.channels[roomName];
        socketServer.socket.emit("roomDeleted", socketServer.info.channels)
        console.log(`${roomName} deleted.`);
        return resolve(socketServer.info.channels);

    })
}

module.exports ={
    createRoom,
    joinRoom,
    leaveRoom,
    deleteRoom
}