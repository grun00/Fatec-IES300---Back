const {ObjectID} = require("mongodb")
const { listAll, findOne , findRandom, insertOne, updateOne, deleteOne } = require("../common/database/db")
const collection = "questions"

exports.listQuestions = async (req, res) => {
    try {
        if( req.query.search=="random"){
            this.findQuestionRandom(req,res)
        }else if(req.query.search=="match"){
            this.findQuestionMatch(req,res)
        }
        else{
        result = await listAll(req.database, collection)
        res.send(result)
        }
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.findOneQuestionByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await findOne(req.database, collection, {_id:  ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}



exports.findQuestionMatch = async (req, res) => {
    try {

        const nivel1 = await findRandom(req.database, collection, 1, req.query.nivel1, null)
        const nivel2 = await findRandom(req.database, collection, 2, req.query.nivel2, null)
        const nivel3 = await findRandom(req.database, collection, 3, req.query.nivel3, null)
        const nivel4 = await findRandom(req.database, collection, 4, req.query.nivel4, null)
        
        const result = nivel1.concat(nivel2).concat(nivel3).concat(nivel4)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.findQuestionRandom = async (req, res) => {
    try {
        const result = await findRandom(req.database, collection, parseInt(req.query.difficulty,10), 1 , req.query.category)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.insertQuestion = async (req, res) => {
    try {
        const result = await insertOne(req.database, collection, req.body)
    } catch (error) {
        res.status(401).send({message: error.message })
    }
}

exports.updateQuestionById = async (req, res) => {
    const {id} = req.params
    const data = req.body
    try {
        const result = await updateOne(req.database, collection, {_id: ObjectID(id)}, data) 
        res.send(result)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

exports.deleteQuestionByID = async (req, res) => {
    const {id} = req.params
    try {
        const result = await deleteOne(req.database, collection, {_id: ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}