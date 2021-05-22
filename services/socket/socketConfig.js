const registerHandlers = require("../../useCases/socketHandlers/registerHandlers")
const socketIO = require('socket.io');

const serverInfo = {
    onlinePlayers: {},
    channels: {
        General: []
    },
}

const configs = {
    cors:{
        origins: '*',
        methods : ["GET", "POST"],
        credentials: false,
    }
}

const createSocket = (server) => {
    const io = socketIO(server, configs);
    io.on('connection', (socket) => {
        console.log("New client connected!");
        const socketServer = {
            socket,
            io,
            info: serverInfo,
        };

        registerHandlers(socketServer)
        socket.emit("connected")
    });
}

module.exports = {
    createSocket
}