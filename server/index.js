const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors())

app.get('/', (req, res) => {
    res.send(JSON.stringify({ message: 'server online' }))
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})