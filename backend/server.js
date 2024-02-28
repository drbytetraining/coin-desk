const express = require('express')
const app = express();
const {PORT} = require('./config/index')
const dbConnect = require('./db/index')

dbConnect();

app.listen(PORT, console.log(`Server is running on ${PORT}`))