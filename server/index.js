const express = require('express');
const cors = require('cors');
const http = require('http');
const {createSocket} = require("../services/socket/socketConfig")
const playersRouter = require("../routes/players-routes") 

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
    req.database = "devDatabase"
     next()
})

server = http.createServer(app)

createSocket(server)




// Routes
app.use("/players", playersRouter)

// app.get('/', (req, res) => {
//     res.send(JSON.stringify({ message: 'server online' }))
// })

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})