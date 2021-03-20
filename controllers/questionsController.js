const {ObjectID} = require("mongodb")
const { listAll, findOne , findRandom } = require("../common/database/db")
const collection = "questions"

exports.listQuestions = async (req, res) => {
    try {
        if( req.query.random=="true"){
            this.findQuestionRandom(req,res)
        }else{
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


exports.findQuestionRandom = async (req, res) => {
    try {
        result = await findRandom(req.database, collection, req.query)
        res.send(result)
    } catch (error) {
        res.status(400).send({message: error.message })
    }
}