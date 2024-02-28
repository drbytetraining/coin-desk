const mongoose = require("mongoose");
const {dbConnString} = require('../config/index')


const dbConnect = async()=>{
    try{
        const conn = await mongoose.connect(dbConnString)
        console.log(`DB Connected with ${conn.connection.host}`)
    }
    catch(error){
        console.log("Error with Database")
    }
}

module.exports = dbConnect;