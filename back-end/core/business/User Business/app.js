// USER BUSINESS
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const  { Proxy } = require('axios-express-proxy');
const axios = require('axios')
const jwt = require('jsonwebtoken');
const { response } = require('express');
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
    [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ]
  ]}))

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET_TOKEN, {
    expiresIn: maxAge
  });
};

app.post('/login',async (req,res)=>{
 
  let {email,password} = req.body;

  //check user data
  console.log("login:", email, password);

  let user_id = undefined;
  try{
    let resp = await axios.post("http://localhost:3003/check-user",{email,password})
    console.log("ok sigup:", resp.data.user)
    user_id = resp.data.user;
  }
  catch(err)
  {
    console.log("err:")
    return res.status(err.response.status).send(JSON.stringify(err.response.data))
  }
  console.log("user id:", user_id);

  let token = createToken(user_id)
  return res.status(200).send(JSON.stringify({token}))
})

app.post('/signup',async(req,res)=>{
  
  let {email,password} = req.body;

  //check user data
  console.log("signup:", email, password);

  let user_id = undefined;
  try{
    let resp = await axios.post("http://localhost:3003/create-user",{email,password})
    console.log("ok sigup:", resp.data.user)
    user_id = resp.data.user;
  }
  catch(err)
  {
    console.log("err:")
    return res.status(err.response.status).send(JSON.stringify(err.response.data))
  }
  console.log("user id:", user_id);

  let token = createToken(user_id)
  console.log("token out:", token)
  return res.status(200).send(JSON.stringify({token}))

})
app.post('/check-token',async(req,res)=>{
  console.log("check-token")

  let token = req.cookies.jwt;
  console.log("token:",token)

  if(token)
  {
    console.log("case 1")
    jwt.verify(token, process.env.SECRET_TOKEN,async (err,decodedToken)=>{
      if(err)
      {
        console.log("case 2")
        return res.status(403).send("Wrong token!");
      }
      else 
      {
        console.log("decoded token:", decodedToken)
        //user user id from token to find user role
        let userRole = await axios.post("http://localhost:3003/get-user-role",{id:decodedToken.id})
        console.log("userRole resp:", userRole.data.role)

        let user_rank = {
          rank: userRole.data.role
        }

        return res.status(200).send(JSON.stringify({user_rank}));
      }
    })
  }
  else 
  {
    console.log("case 3")
    return res.status(401).send("Token is missing!");
  }
});


app.listen(3002,()=>{
    console.log("api gateway is listening at 3002")
})