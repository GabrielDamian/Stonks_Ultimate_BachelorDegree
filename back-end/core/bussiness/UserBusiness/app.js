// USER BUSINESS

// DOCKER SETUP
let hostPOV = 'localhost'
const SERVER_ADDRESS = 3002
const service_id = "User Business"

console.log(process.argv[2])
if(process.argv[2] !== undefined)
{
    hostPOV = '172.17.0.1'
}
console.log("HOST POV:", hostPOV)

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
        "http://localhost:3004",
        "http://localhost:3005",
        "http://localhost:3006",
      ]
]}))

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET_TOKEN, {
    expiresIn: maxAge
  });
};

app.get('/test',(req,res)=>{
  return res.send('node ok 1')
})

app.post('/login',async (req,res, next)=>{

  try{
    let {email,password} = req.body;
    let user_id = undefined;
    try{
      let resp = await axios.post(`http://${hostPOV}:3003/check-user`,{email,password})
      user_id = resp.data.user;
    }
    catch(err)
    {
      console.log("err:",err)
      return res.status(err.response.status).send(JSON.stringify(err.response.data))
    }
    let token = createToken(user_id)
    return res.status(200).send(JSON.stringify({token}))
  }
  catch(err)
  {
    next(err);
  }
})

app.post('/signup',async(req,res, next)=>{
  try{
    let {email,password, username} = req.body;
    let user_id = undefined;
    try{
      let resp = await axios.post(`http://${hostPOV}:3003/create-user`,{email,password,username})
      user_id = resp.data.user;
    }
    catch(err)
    {
      console.log("err:",err)
      return res.status(err.response.status).send(JSON.stringify(err.response.data))
    }
    let token = createToken(user_id)
    return res.status(200).send(JSON.stringify({token}))
  }
  catch(err)
  {
    next(err);
  }
})

//used in apy gateway
app.post('/check-token',async(req,res)=>{
  try{
    let {token} = req.body;
    if(token)
    {
      jwt.verify(token, process.env.SECRET_TOKEN,async (err,decodedToken)=>{
        if(err)
        {
          return res.status(403).send("Wrong token!");
        }
        else 
        {
          //user user id from token to find user role
          let userRole = await axios.post(`http://${hostPOV}:3003/collect-user-data`,{id:decodedToken.id})
          let user_rank = {
            id:decodedToken.id,
            role: userRole.data.role
          }
  
          return res.status(200).send(JSON.stringify({...user_rank}));
        }
      })
    }
    else 
    {
      return res.status(401).send("Token is missing!");
    }
  }
  catch(err)
  {
    next(err);
  }
});

app.post('/collect-user-data', async(req,res)=>{
  try{
    let userId = req.body.id;
    //user user id from token to find user role
    let userInfo = await axios.post(`http://${hostPOV}:3003/collect-user-data`,{id:userId})
  
    let userNodes = await axios.post(`http://${hostPOV}:3005/get-user-nodes`,{owner:userId})
    userInfo.data['nodes'] = [...userNodes.data.nodes]
  
    let data = {}
    let fields = ['email','_id','role','username','nodes']
    fields.forEach((field)=>{
      data[field] = userInfo.data[field]
    })
    return res.status(200).send(JSON.stringify({...data}));
  }
  catch(err)
  {
    next(err);
  }
})

app.get('/all-users', async(req,res)=>{
  try{
    let allUsers = await axios.get(`http://${hostPOV}:3003/all-users`)
    console.log("allUsers1:",allUsers.data)
    return res.status(200).send(JSON.stringify([...allUsers.data]));
  }
  catch(err)
  {
    next(err);
  }
})

app.post('/update-fields', async(req,res)=>{

  console.log("update fields business:", req.body);

  let userId = undefined;
  try{
    let  availableFields = ['role','email','username'] 
    Object.keys(req.body).forEach((field)=>{
      console.log("magic:", !availableFields.includes(field) && field == 'userId')
      console.log("between:", field )
      if(!availableFields.includes(field))
      {
        if(field != 'userId')
        {
          throw new Error(`Can't update field ${field}`)
        }
      }
    })
    userId = req.body.userId
    if(userId == undefined) return res.status(400).send("Can't update fields whitout a userId")

    let dbUpdateResp = await axios.post(`http://${hostPOV}:3003/update-fields`,{...req.body})
    console.log("dbUpdateResp:",dbUpdateResp)
    return res.status(200).send(JSON.stringify({_id: dbUpdateResp._id}))
  }
  catch(err)
  {
    console.log("err:",err)
    return res.status(400).send("Nu se pot updata field-urile utilizator!")
  }
})

app.post('/delete',async(req,res)=>{
  try{
    
    let {userId} = req.body;
    console.log("delete user id:", userId);
    let dbDeleteResp = await axios.post(`http://${hostPOV}:3003/delete`,{userId})
    console.log("before return")
    return res.status(200).send({userId})

  }
  catch(err)
  {
    console.log("Can't delete user:")
    return res.status(400).send("Can't delete user!")
  }
})
// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(SERVER_ADDRESS,()=>{
  console.log(`User Business Service at port ${SERVER_ADDRESS} `)
})

// API GATEWAY LOGIC
const SubscribeAction = async ()=>{
    function sleep(milliseconds) {  
      return new Promise(resolve => setTimeout(resolve, milliseconds));  
  } 
    const resources = {
      'login_POST':{
        needsAuth: false,
        roles: [],
        route: 'login'
    },
    'signup_POST':{
        needsAuth: false,
        roles: [],
        route: 'signup'
    },
    'check-token_POST':{
        needsAuth: true,
        roles:[],
        route: 'check-token'
    },
    'collect-user-data_POST':{
        needsAuth: true,
        roles: [],
        route: 'collect-user-data'
    },
    'all-users_GET':{
      needsAuth: true,
      roles: [],
      route: 'all-users'
    },
    'update-fields_POST':{
      needsAuth: true,
      roles: [],
      route: 'update-fields'
    },
    'delete_POST':{
      needsAuth: true,
      roles: [],
      route: 'delete'
    }
  }
    let status_subscribe = false;
    while(!status_subscribe)
    {
      console.log("try to subs")
      await sleep(1000);
      try{
        let resp = await axios.post(`http://${hostPOV}:3001/subscribe`,{
          service_id,
          SERVER_ADDRESS,
          resources
        })
        console.log("resp subbs:", resp.data)
        status_subscribe = true;
      }
      catch(e)
      {
        console.log("Failed to subscribe")
      }
    }
}

const HeartBeat = async ()=>{
  try{
    await axios.post(`http://${hostPOV}:3001/heart-beat`,{
      service_id,
    })
  }
  catch(e)
  {
    console.log("Failed to HeartBeat")
  }
}

setInterval(()=>{
  HeartBeat();
},5000)

SubscribeAction()
