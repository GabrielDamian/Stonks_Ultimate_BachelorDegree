const User = require("../models/User");
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

module.exports.signup = async (req, res) => {
  try {
    const { email, password,username } = req.body;
    const user = await User.create({ email, password, username });
    return res.status(201).json({ 
      user: user._id,
    });
  }
  catch(err) {
    const errors = handleErrors(err);
    return res.status(500).json({ errors });
  }
}

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    res.status(200).json({ 
      user: user._id,
    });
  } 
  catch (err) {
    const errors = handleErrors(err);
    return res.status(500).json({ errors });
  }

}

module.exports.user_data = async(req,res)=>{
  const id = req.params.id;
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
  }
  catch(err)
  {
    return res.status(500).send("Can't find id")
  }

}

module.exports.all_users = async(req,res)=>{
  try{
    User.find({},(err,doc)=>{
      if(err)
      {
        return res.status(401).send("Invalid token")
      }
      else
      {
        return res.status(200).send(JSON.stringify([...doc]))
      }
    })
  }
  catch(err)
  {
    return res.status(500).send("Can't find any user")
  }
}

module.exports.update_fields = async(req,res)=>{
  try{
    let userId = req.body.userId;
    let fieldsToUpdate = {...req.body}
    delete fieldsToUpdate.userId

    await User.findOneAndUpdate(
      {
        _id: userId
      },
      {
        ...fieldsToUpdate
      },
      {new: true, useFindAndModify: false}
      )
      return res.status(200).send("Fields updated succesfully!")
  }
  catch(err)
  {
    return res.status(500).send("Can't update user fields")
  }
}

module.exports.delete = async(req,res)=>{
  try{
    const userId = req.params.id;
    await User.findOneAndDelete({_id: userId})
    return res.status(200).send("User deleted!")
  }
  catch(err)
  {
    return res.status(500).send("Can't delete user")
  }
}