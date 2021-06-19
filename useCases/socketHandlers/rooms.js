const { prepareMatch } = require("./match")

const createRoom = async (socketServer, roomInfo) => {
  if (Object.keys(socketServer.info.channels).includes(roomInfo.roomName)) {
    console.log(`${roomInfo.roomName} already exists.`);
    return false;
  }

  let themes = ['Atualidades', 'TI', 'Conhecimentos Gerais', 'Entretenimento' ];
  removeItemOnce(themes, roomInfo.roomTheme);

  socketServer.info.channels[roomInfo.roomName] = {};
  socketServer.info.channels[roomInfo.roomName].players = [socketServer.socket.player];
  socketServer.info.channels[roomInfo.roomName].questions = await prepareMatch('devDatabase', 'questions', 5, themes);
  socketServer.info.channels[roomInfo.roomName].matchData = {};
  socketServer.info.channels[roomInfo.roomName].password = roomInfo.roomPwd;
  socketServer.socket.currentRoom = roomInfo.roomName;
  socketServer.socket.join(roomInfo.roomName);
  console.log(`Room ${roomInfo.roomName} created`, socketServer.info.channels);
  socketServer.io.emit("roomCreated", socketServer.info.channels);
  return true;
};

const leaveRoom = (socketServer, leaveAll = false) => {
  const roomName = socketServer.socket.currentRoom;
  if (!Object.keys(socketServer.info.channels).includes(roomName)) {
    console.log(`Leave Error: ${roomName} doesn't exist.`);
    return false;
  }
  if (
    !socketServer.info.channels[roomName].players.includes(socketServer.socket.player)
  ) {
    console.log(
      `Player ${socketServer.socket.info} not in ${roomName}`,
      socketServer.info.channels
    );
    return false;
  }
  socketServer.info.channels[roomName].players = socketServer.info.channels[
    roomName
  ].players.filter((item) => item !== socketServer.socket.player);
  if (!leaveAll) {
    try {
      console.log("currentRoom", socketServer.socket.currentRoom);
      joinRoom(socketServer, "General");
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  socketServer.socket.emit("leftRoom", socketServer.info.channels);
  console.log(`${socketServer.socket.username} has left ${roomName}`);
  console.log("leftRoom", socketServer.info.channels);
  if(socketServer.info.channels[roomName].players.length === 0 ){
    console.log("Deleting Room")
    try{
      deleteRoom(socketServer, roomName)
    } catch (error) {
      console.log("Leave Room:", error)
    }
  }
  return true;
};

const joinRoom = (socketServer, roomInfo) => {
  if (!Object.keys(socketServer.info.channels).includes(roomInfo.roomName)) {
    console.log(`Join Error: ${roomInfo.roomName} doesn't exist.`);
    return false;
  }
  if (socketServer.socket.currentRoom !== "General") {
    try {
      leaveRoom(socketServer, socketServer.socket.currentRoom);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  if (roomInfo.roomPwd !== socketServer.info.channels[roomInfo.roomName].password) {
    console.log('wrong pwd');
    return false;
  }

  socketServer.socket.join(roomInfo.roomName);
  socketServer.info.channels[roomInfo.roomName].players.push(socketServer.socket.player);
  socketServer.socket.currentRoom = roomInfo.roomName;
  socketServer.socket.to(roomInfo.roomName).emit("Here")
  socketServer.socket.emit("joinedRoom", socketServer.info.channels);
  console.log(`${socketServer.socket.username} joined ${roomInfo.roomName}`);

  return true;
};

const deleteRoom = (socketServer, roomName) => {
  if (!Object.keys(socketServer.info.channels).includes(roomName)) {
    console.log(`Deleting Room Error: ${roomName} doesn't exist.`);
    return false;
  }
  delete socketServer.info.channels[roomName];
  socketServer.socket.emit("roomDeleted", socketServer.info.channels);
  console.log(`${roomName} deleted.`);
  return true;
};

const getRoomInfo = (socketServer) => {
    const roomName = socketServer.socket.currentRoom;
    const players = socketServer.info.channels[roomName].players
    const playerCount = players.length
    const questions = socketServer.info.channels[roomName].questions
    socketServer.io.to(roomName).emit("roomInfo", {roomName, players, playerCount, questions})
    return true;
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  getRoomInfo,
};
