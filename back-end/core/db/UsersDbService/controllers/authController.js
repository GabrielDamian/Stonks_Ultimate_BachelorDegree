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
    Object.values(err.errors).forEach(({ properties }) => {
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
  const { email, password,username } = req.body;

  try {
    const user = await User.create({ email, password, username });
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
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    // const token = createToken(user._id);
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

module.exports.collect_user_data = async(req,res)=>{
  const { id } = req.body;
  try{
    User.findById(id,(err,doc)=>{
      if(err)
      {
        return res.status(401).send("Invalid token")
      }
      else
      {
        return res.status(200).send(JSON.stringify({...doc._doc}))
      }
    })
    // return res.status(200).send(JSON.stringify(user_role))
    
  }
  catch(err)
  {
    console.log("err find by id")
    res.status(400).send("Can't find id")
  }

}

module.exports.all_users = async(req,res)=>{

  console.log("all users aentry")
  
  try{
    User.find({},(err,doc)=>{
      if(err)
      {
        console.log("case 1")
        return res.status(401).send("Invalid token")
      }
      else
      {
        console.log("case 2:", doc)
        return res.status(200).send(JSON.stringify([...doc]))
      }
    })
  }
  catch(err)
  {
    return res.status(400).send("Can't find any user")
  }
}

module.exports.update_fields = async(req,res)=>{
  
  console.log("update fields:", req.body);
  
  try{
    let userId = req.body.userId;
    let fieldsToUpdate = {...req.body}
    delete fieldsToUpdate.userId

    console.log("fieldsToUpdate final:",fieldsToUpdate)
    console.log("userID:", userId)
    let updateResponse = await User.findOneAndUpdate(
      {
        _id: userId
      },
      {
        ...fieldsToUpdate
      },
      {new: true, useFindAndModify: false}
      )
      console.log("updateResponse:",updateResponse)
      return res.status(200).send("Fields updated succesfully!")
  }
  catch(err)
  {
    return res.status(400).send("Can't update user fields")
  }
}

module.exports.delete = async(req,res)=>{
  try{
    let {userId} = req.body;
    console.log("user to delete:", userId)
    let deleteResp = await User.findOneAndDelete({_id: userId})
    console.log("delete resp:")
    return res.status(200).send("User deleted!")
  }
  catch(err)
  {
    console.log("can't delete user:", err)
    return res.status(400).send("Can't delete user")
  }
}