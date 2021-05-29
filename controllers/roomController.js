const {ObjectID} = require("mongodb")
const { listAll, updateOne, deleteOne, findDocuments, findOne, insertOne } = require("../common/database/db")
const collection = "rooms"

exports.listRooms = async (req, res) => {
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

exports.findRooms = async (req, res) => {
    try {
        result = await findDocuments(req.database, collection, req.query)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.insertRooms = async (req, res) => {
    try{
        result = await insertOne(req.database, collection, req.body)
        res.send(result)
    }catch(error){
        res.status(401).send({message: error.message})
    }
}

exports.findOneRoomByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await findOne(req.database, collection, {_id:  ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.deleteRoomByID = async (req, res) => {
    const {id} = req.params
    try {
        result = await deleteOne(req.database, collection, {_id: ObjectID(id)})
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}

exports.updateRoomByID = async (req, res) => {
    const {id} = req.params
    const data = req.body

    try {
        result = await updateOne(req.database, collection, {_id: ObjectID(id)}, data)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}