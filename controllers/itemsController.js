const {ObjectID} = require("mongodb")
const { listAll, updateOne, deleteOne, findDocuments, findOne, insertOne } = require("../common/database/db")
const collection = "items"

exports.listItems = async (req, res) => {
    try {
        if(req.query!=null){
            this.findItems(req,res)
        }else{
        result = await listAll(req.database, collection)
        res.send(result)
        }
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.findItems = async (req, res) => {
    try {
        result = await findDocuments(req.database, collection, req.query)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.insertItems = async (req, res) => {
    try{
        result = await insertOne(req.database, collection, req.body)
        res.send(result)
    }catch(error){
        res.status(401).send({message: error.message})
    }
}

exports.findOneItemByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await findOne(req.database, collection, {_id:  ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.deleteItemByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await deleteOne(req.database, collection, {_id: ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.updateItemByID = async (req, res) => {
    const {id} = req.params
    const data = req.body

    try {
        result = await updateOne(req.database, collection, {_id: ObjectID(id)}, data)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}