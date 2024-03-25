const dotenv = require('dotenv').config();


// const PORT = process.env.PORT;
// const dbConnString = process.env.dbConnString;


const {PORT, dbConnString, ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, BACKEND_SERVER_PATH} = process.env

module.exports = {
    PORT,
    dbConnString,
    ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY,
    BACKEND_SERVER_PATH
}
