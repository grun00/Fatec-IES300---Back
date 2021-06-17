require("dotenv/config")
const { query } = require("express")
const {getConnection} = require("../../services/mongodb/connection")
const dbUser = process.env.DATABASE_USER
const dbPassword = process.env.DATABASE_PASSWORD


// Simple CRUD

// Database URI String
const uri = `mongodb+srv://${dbUser}:${dbPassword}@dev.jd1pc.mongodb.net/`


// Lists all Documents of given Database
const listAll = async (database, collection) => {
    let result;
    let client;
    try {
        client = await getConnection(uri)
        const cursor = await client.db(database).collection(collection);
        result = await cursor.find({}).toArray()

    } catch (error) {
        console.log(`Error: ${error}`)
        result = error

    } finally {

        client ? client.close() : null
        return result
    }
}

// Updates or Creates a Document filtered by a Query Argument
const updateOne = async (database, collection, query, data) => {
    let client;
    let result;
    try {
        client = await getConnection(uri)
        const cursor = await client.db(database).collection(collection);
        await cursor.updateOne(query, {$set: data}, {upsert:true})
        result = {message: "Document updated"}

    } catch (error) {
        console.log(`Error: ${error.message}`)
       result = {
           message: "Update failed",
           error: error.message
        }
    } finally {
        client ? client.close() : null
        return result
    }
}

// Deletes a Document filtered by a Query Argument
const deleteOne = async (database, collection, query) => {
    let client;
    let result;
    try {
        client = await getConnection(uri)
        cursor = await client.db(database).collection(collection);
        await cursor.deleteOne(query)
        result =  {message: "Document deleted"}

    } catch (error) {
        console.log(`Error: ${error.message}`)
        result = {message: "Operation failed",
    error: error.message }
    } finally {
        client ? client.close() : null
        return result
    }
}

// Retrieves a specific Document filtered by a Query Argument

const findOne = async (database, collection, query) => {
    let client
    let result
    try {
        client = await getConnection(uri)
        const cursor = await client.db(database).collection(collection);
        result = await cursor.findOne(query)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        result = {message: "Operation failed",
    error: error.message }
    } finally {
        client ? client.close() : null
        return result
    }
}

// Retrieves a specific Document filtered by a Query Argument

const findDocuments = async (database, collection, query) => {
    let client;
    let result;
    try {
        client = await getConnection(uri)
        cursor = await client.db(database).collection(collection);
        result = await cursor.find(query).toArray()
    } catch (error) {
        console.log(`Error: ${error.message}`)
        result = {message: "Operation failed",
    error: error.message }
    } finally {
        client ? client.close() : null
        return result
    }
}
const insertOne = async (database, collection, data) => {
    let client;
    let result;

    try{
        client = await getConnection(uri)
        cursor = await client.db(database).collection(collection);
        await cursor.insertOne(data)
        result = {message: "Document inserted"}
    }catch{
        console.log(`Error: ${error.message}`)
        result = {message: "Operation failed",
    error: error.message }
    }finally{
        client ? client.close() : null
        return result
    }
}

const findRandom = async (database, collection, difficulty, quantity, category) => {

    let client;
    let result;
    try {

        client = await getConnection(uri)
        cursor = await client.db(database).collection(collection);

        if( category == '')
            delete query.category

      result = await cursor.aggregate(
        [
          {$match: { "difficulty": difficulty, "category": { $in: category }}},
          {$sample: {size:parseInt(quantity,10)}}
        ]
      ).toArray()

      console.log(result)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        result = {message: "Operation failed",
    error: error.message }
    } finally {
        client ? client.close() : null
        return result
    }



}


module.exports = {
    listAll,
    updateOne,
    deleteOne,
    findOne,
    findDocuments,
    insertOne,
    findRandom
}
