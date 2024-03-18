const JWTService = require('../services/JWTService'),
 User = require('../models/user'),
 UserDto = require('../dto/user'),

 auth = async (req, res, next)=>{
    try{
        const {accessToken, refreshToken} = req.cookies;

        if(!refreshToken || !accessToken){
           const error = {
            status: 401,
            message: 'Unauthorized'
           }

           return next(error)
        }
let _id;

try{
     _id =  JWTService.verifyAccessToken(accessToken)._id // 10 =============== _id = 10
}
catch(error){
    return next(error)
}

let user;

try{
   user =  await User.findOne({_id: _id}) // id = 10


}catch(error){
    return next(error)
}

const userDto = new UserDto(user);



req.user = userDto;

next();

    }
    catch(error){
        return next(error)
    }
};

module.exports = auth