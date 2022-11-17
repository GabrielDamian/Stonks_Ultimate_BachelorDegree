const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongoose");
require("dotenv").config();
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: maxAge
  });
};

// controller actions

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).json({ 
      user: user._id,
    });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.check_user_post = async (req, res) => {
  console.log("login")
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    // const token = createToken(user._id);
    console.log("response ok:", user._id);
    res.status(200).json({ 
      user: user._id,
      // token: token
    });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}


module.exports.get_user_role = async(req,res)=>{
  const { id } = req.body;
  console.log("id to fnd:",id)
  try{
    User.findById(id,(err,doc)=>{
      if(err)
      {
        console.log("err:",err)
        return res.status(401).send("Invalid token")
      }
      else
      {
        let user_role = 
        {
          role: doc.role
        }
        console.log("mongose result", doc)
        console.log("role raw:",doc.role)

        return res.status(200).send(JSON.stringify(user_role))

      }
    })
    // return res.status(200).send(JSON.stringify(user_role))
    
  }
  catch(err)
  {
    console.log("err find by id")
  }

}