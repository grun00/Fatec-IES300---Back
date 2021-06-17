const { findRandom } = require("../../common/database/db");
const _ = require('lodash');
const database =  'devDatabase';
const collection = 'questions';

const randomizeAlternatives = (question) => {
    if(question.alternatives && question.answer){
        const matchAlternatives = _.shuffle([...question.alternatives, question.answer]);
        const answerIndex = matchAlternatives.indexOf(question.answer)
        return {matchAlternatives, answerIndex: answerIndex};
    }
    return null;
}

const prepareMatch = async (database, collection, quantity, themes) => {
    const lvl1 = await findRandom(database, collection, 1, quantity, themes)
    const lvl2 = await findRandom(database, collection, 2, quantity, themes)
    const lvl3 = await findRandom(database, collection, 3, quantity, themes)
    const lvl4 = await findRandom(database, collection, 4, 1, themes)
    const questions = [...lvl1, ...lvl2, ...lvl3, ...lvl4]
    for(let question of questions){
         const {matchAlternatives, answerIndex} = randomizeAlternatives(question)
        question.randomAlternatives = matchAlternatives
        question.answerIndex = answerIndex
    }
    return questions
}

const assignQuestions =  async (socketServer) => {
    const roomName = socketServer.socket.currentRoom
    if(!Object.keys(socketServer.info.channels).includes(roomName)){
        console.log(`Prepare Match Error: ${roomName} doesn't exist.`)
        return false;
    }
    const matchQuestions = await prepareMatch(database, collection, 5);
    socketServer.io.to(roomName).emit("questionsAssigned", matchQuestions);
    return true;
}

const canStart = (socketServer) => {
    console.log(socketServer.io.of("/").adapter.rooms)
    const roomName = socketServer.socket.currenRoom;
    if(!roomName) return false;

    const questions = socketServer.info.channels[roomName].questions;
    const playerCount = socketServer.info.channels[roomName].players.length;

    if(!Object.keys(socketServer.info.channels).includes(roomName)){
        console.log(`canStart Match Error: ${roomName} doesn't exist.`)
        socketServer.socket.to(roomName).emit("canStart", false)
        return false;
    }

    if(playerCount < 2){
        console.log(`canStart Match Error: Not enough players.`)
        socketServer.socket.to(roomName).emit("canStart", false)
        return false;
    }

    if(!questions){
        console.log(`canStart Match Error: No questions assigned.`)
        socketServer.socket.to(roomName).emit("canStart", false)
        return false;
    }

    socketServer.socket.to(roomName).emit("canStart", true)
    return true;

}

const recordAnswer = (socketServer, data) => {
    const {player, myChosenAlternative, questionNumber, correct, currentTime} = data
    const roomName = socketServer.socket.currentRoom;
    const oldData = socketServer.info.channels[roomName].matchData
    const newData = {
        [player]: {
        [questionNumber]: {
                myAnswer: myChosenAlternative,
                correct: correct,
                points: correct ? 1 * (currentTime/20) : 0
            }
        }
    }
    socketServer.info.channels[roomName].matchData[player] = {...oldData[player], ...newData[player]};

    socketServer.socket.emit('answerRecorded')
    socketServer.socket.to(roomName).emit("opponentReady", true)
    console.log(socketServer.info.channels[roomName].matchData)
}

const timeUp = (socketServer, {player, myChosenAlternative, questionNumber, correct, currentTime}=matchData) => {
    const roomName = socketServer.socket.currentRoom;
    console.log(roomName);
    const oldData = socketServer.info.channels[roomName].matchData
    const newData = {
        [player]: {
        [questionNumber]: {
                myAnswer: myChosenAlternative,
                correct: correct,
                points: 0
            }
        }
    }
    socketServer.info.channels[roomName].matchData[player] = {...oldData[player], ...newData[player]};

    socketServer.socket.emit('answerRecorded')
    socketServer.socket.to(roomName).emit("opponentReady", true)
    console.log(socketServer.info.channels[roomName].matchData)
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

module.exports = {
    assignQuestions,
    prepareMatch,
    canStart,
    recordAnswer,
    timeUp
}
