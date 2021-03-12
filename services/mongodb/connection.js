const {MongoClient} = require("mongodb")


const getConnection = (uri) => {
return new Promise((resolve, reject ) => {
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.log(err.message)
            return reject(err);
        } else{
            console.log("Connected to Database")
            return resolve(client)
        }
    });
})
} 


module.exports = { getConnection }