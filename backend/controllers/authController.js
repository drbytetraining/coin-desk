const Joi = require("joi");
const passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const UserDto = require("../dto/user");
const JWTService = require('../services/JWTService');
const RefreshToken = require('../models/token');
const token = require("../models/token");

const authController = {
  async register(req, res, next) {
    //data validation / form vaidation

    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(25).required(),
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passPattern).required(),
      confirmPassword: Joi.ref("password"),
    });


    // error from joi = validation error
    const { error } = userRegisterSchema.validate(req.body);

    // const error = userRegisterSchema.validate(req.body).error

    if(error){
        return next(error)
    }

    const { username, name, email, password, confirmPassword } = req.body

    // user already registered

    try {
        const emailInUse = await User.exists({email});
        const usernameInUse = await User.exists({ username });


        if (emailInUse) {
            const error = {
                status: 409,
                message: "Email Already Registered, Use another Email"
            }
            return next(error)
        }
        if (usernameInUse) {
            const error = {
                status: 409,
                message: "Username Already Registered, choose another username"
            }
            return next(error)
        }
        }
    catch (error) {
        return next(error)
    }

//================//
//hash password

const hashedPassword = await bcrypt.hash(password, 10);

//=====================//

// store data in db


let user;
let accessToken;
let refreshToken;

try{
    const userToRegister = new User({
        username,
        email,
        name,
        password: hashedPassword
    })
    
 user = await userToRegister.save();

 //generate access token;

 accessToken = JWTService.signAccessToken({_id: user._id}, '30m');

 //generate refresh token
 refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m')


}
catch(error){
    return next(error)
}

// store refresh token

 JWTService.storeRefreshToken(refreshToken, user._id);



 /// send acces token using cookie

 res.cookie('accessToken', accessToken, {
    maxAge : 1000 * 60 * 60 * 24 ,
    httpOnly: true
 })

 res.cookie('refreshToken', refreshToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
 })


//===========//
// response

const userDto = new UserDto(user)

return res.status(201).json({ user, auth: true})

  },


  async login(req, res, next){
    // user data - check/ validate
    // midleware - error
    // if validate - username and password compare
    //if not matched -- error
    // if match successfully - response // 200

    const userLoginSchema = Joi.object({
        username: Joi.string().min(5).max(25).required(),
        password: Joi.string().pattern(passPattern).required()
    })

    const {error} = userLoginSchema.validate(req.body);

    if(error){
        return next(error)
    }

    // if above block does not run, match username
    const {username, password} =req.body;

    // const username = req.body.username
        let user;
    try{
        user = await User.findOne({username: username});

        if(!user){
            const error = {
                status: 401,
                message: "Invalid Username"
            }

            return next(error)
        }

        const match = await bcrypt.compare(password, user.password)

        if(!match){
            const error = {
                status: 401,
                message: "Invalid Password"
            }
            return next(error)
        }
    }
    catch(error){
        return next(error)
    }
    // =============== USER READY TO GO =================//

    const accessToken = JWTService.signAccessToken({_id: user._id}, '30m');
    const refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m')

    // ===== refresh token update in database
    try{
        await RefreshToken.updateOne(
            {token: refreshToken},
            {upsert: true},
            { _id: user._id}
        )
    }catch(error){
                console.log(error)
    }

   /// send acces token using cookie

 res.cookie('accessToken', accessToken, {
    maxAge : 1000 * 60 * 60 * 24 ,
    httpOnly: true
 })

 res.cookie('refreshToken', refreshToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
 })



    // filter the neccessary credentials
    const userDto = new UserDto(user)


    return res.status(200).json({user:userDto, auth: true})
    


  },



  async logout(req, res, next){

    console.log(req)
    const {refreshToken} = req.cookies;

    try{
        await RefreshToken.deleteOne({token: refreshToken})
    }
    catch(error){
        return next(error)
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({user: null, auth: false})

  }
};

module.exports = authController


