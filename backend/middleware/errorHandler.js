const {ValidationError} = require('joi')

const errorHandler = (error, req, res, next)=>{
    //default  error
    let status = 500;

    let data = {
        message: 'Internal server error'
    }


    
    if(error instanceof ValidationError){
        status =  401;
        data.message = error.message;

        return res.status(status).json(data)  //error may be main or from joi
    }

    //if error from joi have status value, update it
    if(error.status){
        status = error.status
    }

    //if error from joi have message value, update it
    if(error.message){
        data.message = error.message;
    }

    
    return res.status(status).json(data)


}
module.exports = errorHandler;






// transfarmer



// wire damage 300

// meter defaulter  350

// bijli choori    450

