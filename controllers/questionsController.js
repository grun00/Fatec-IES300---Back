const {ObjectID} = require("mongodb")
const { listAll,  findDocuments, findOne } = require("../common/database/db")
const collection = "questions"

exports.listQuestions = async (req, res) => {
    try {
        result = await listAll(req.database, collection)
        res.send(result)
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

exports.findQuestions = async (req, res) => {
    try {
        result = await findDocuments(req.database, collection, req.body)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}