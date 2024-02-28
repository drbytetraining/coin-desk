const express = require('express')
const app = express();
const {PORT} = require('./config/index')
const dbConnect = require('./db/index')
const errorHandler = require('./middleware/errorHandler')
const router = require('./routes/index')



app.use(express.json())
app.use(router)

dbConnect();

// app.get('/', (req, res)=> res.json({hello: "Greetings"}));



app.use(errorHandler)
app.listen(PORT, console.log(`Server is running on ${PORT}`))