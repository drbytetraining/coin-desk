const mongoose = require("mongoose");
const {dbConnString} = require('../config/index')


const dbConnect = async()=>{
    try{
        await mongoose.connect(dbConnString)
        console.log('DB Connected')
    }
    catch(error){
        console.log("Error with Database")
    }
}

module.exports = dbConnect;