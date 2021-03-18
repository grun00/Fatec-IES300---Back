const {ObjectID} = require("mongodb")
const { listAll, updateOne, deleteOne, findDocuments, findOne, insertOne } = require("../common/database/db")
const collection = "players"

exports.listPlayers = async (req, res) => {
    try {
        result = await listAll(req.database, collection)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.updatePlayerByID = async (req, res) => {
    const {id} = req.params
    const data = req.body

    try {
        result = await updateOne(req.database, collection, {_id: ObjectID(id)}, data)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.deletePlayerByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await deleteOne(req.database, collection, {_id: ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.findOnePlayerByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await findOne(req.database, collection, {_id:  ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.findPlayers = async (req, res) => {
    try {
        result = await findDocuments(req.database, collection, req.body)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.insertPlayer = async (req, res) => {
    try{
        
        result = await insertOne(req.database, collection, req.body)
        
        res.send(result)
    }catch(error){
        res.status(401).send({message: error.message})
    }
}