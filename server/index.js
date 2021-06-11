const express = require('express');
const cors = require('cors');

const swaggerRouter = require("../routes/swagger-routes");
const playersRouter = require("../routes/players-routes");

const http = require('http');
const {createSocket} = require("../services/socket/socketConfig")

const questionsRouter = require("../routes/questions-routes") ;
const itemsRouter = require('../routes/items-router')

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
app.use("/players", playersRouter);
app.use("/docs", swaggerRouter)
app.use("/questions", questionsRouter);

app.use("/items", itemsRouter);

// app.get('/', (req, res) => {
//     res.send(JSON.stringify({ message: 'server online' }))
// })

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})