const { findRandom } = require("../../common/database/db");
const _ = require('lodash');
const database =  'devDatabase';
const collection = 'questions';

const randomizeAlternatives = (question) => {
    if(question.alternatives && question.answer){
        const matchAlternatives = _.shuffle([...question.alternatives, question.answer]);
        const answerIndex = [];
        matchAlternatives.forEach((element, index) => {
            if(element === question.answer) { 
                answerIndex.push(index)
            }
        });
        return {matchAlternatives, answerIndex: answerIndex[0]};
    }
    return null;
}

const prepareMatch = async (database, collection, quantity) => {
    const lvl1 = await findRandom(database, collection, 1, quantity, null)
    const lvl2 = await findRandom(database, collection, 2, quantity, null)
    const lvl3 = await findRandom(database, collection, 3, quantity, null)
    const lvl4 = await findRandom(database, collection, 4, 1, null)
    const questions = [...lvl1, ...lvl2, ...lvl3, ...lvl4]
    for(let question of questions){
         const {matchAlternatives, answerIndex} = randomizeAlternatives(question)
        question.randomAlternatives = matchAlternatives
        question.answerIndex = answerIndex
    }
    console.log(questions[0])
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
    const roomName = socketServer.socket.roomName;
    if(!roomName) return false;
    
    const questions = socketServer.info.channels[roomName].questions;
    const playerCount = socketServer.info.channels[roomName].players.legnth;
     
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

module.exports = {
    assignQuestions,
    prepareMatch,
    canStart,
}