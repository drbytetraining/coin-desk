const dotenv = require('dotenv').config();


// const PORT = process.env.PORT;
// const dbConnString = process.env.dbConnString;


const {PORT, dbConnString, ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY} = process.env

module.exports = {
    PORT,
    dbConnString,
    ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY
}
