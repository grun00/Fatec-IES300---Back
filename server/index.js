const express = require('express');
const cors = require('cors');

const playersRouter = require("../routes/players-routes");
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

// Routes
app.use("/players", playersRouter);

app.use("/questions", questionsRouter);

app.use("/items", itemsRouter);

// app.get('/', (req, res) => {
//     res.send(JSON.stringify({ message: 'server online' }))
// })

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
