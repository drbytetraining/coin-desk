const express = require('express')
const app = express();
const {PORT} = require('./config/index')
const dbConnect = require('./db/index')
const errorHandler = require('./middleware/errorHandler')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')



app.use(express.json());

app.use(cookieParser);
app.use(router)

dbConnect();





app.use(errorHandler)

app.listen(PORT, console.log(`Server is running on ${PORT}`))