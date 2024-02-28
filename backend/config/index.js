const dotenv = require('dotenv').config();

const PORT = process.env.PORT,
dbConnString = process.env.dbConnString;

module.exports = {
    PORT,
    dbConnString
}