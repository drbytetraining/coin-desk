const Joi = require("joi");
const passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
const User = require('../models/user');
const bcrypt = require('bcryptjs');



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

    const { error } = userRegisterSchema.validate(req.body);

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



const userToRegister = new User({
    username,
    email,
    name,
    password: hashedPassword
})

const user = await userToRegister.save();

//===========//
// response

return res.status(201).json({ user })

  },

  async login(){

  }
};

module.exports = authController