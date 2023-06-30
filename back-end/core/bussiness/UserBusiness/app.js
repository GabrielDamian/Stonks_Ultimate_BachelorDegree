// USER BUSINESS

// DOCKER SETUP
let hostPOV = 'localhost'
const SERVER_ADDRESS = 3002
const service_id = "User Business"

if(process.argv[2] !== undefined)
{
    hostPOV = '172.17.0.1'
}

const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const axios = require('axios')
const jwt = require('jsonwebtoken');
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


app.post('/login',async (req,res)=>{
  try{
    let {email,password} = req.body;
    let user_id = undefined;

    let resp = await axios.post(`http://${hostPOV}:3003/login`,{email,password})
    user_id = resp.data.user;


    let token = createToken(user_id)
    return res.status(201).send(JSON.stringify({token}))
  }
  catch(err)
  {
    return res.status(500).send({...err.response.data})
  }
})

app.post('/signup',async(req,res)=>{
  console.log("signup enty")
  try{
    let {email,password, username} = req.body;
    let user_id = undefined;
    console.log("before req")
    let resp = await axios.post(`http://${hostPOV}:3003/user`,{email,password,username})
    console.log("resp in db:", resp.data);
    user_id = resp.data.user;

    let token = createToken(user_id)
    return res.status(200).send(JSON.stringify({token}))
  }
  catch(err)
  {
    console.log("err111:", )
    return res.status(500).send({...err.response.data})
  }
})

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
          // let userRole = await axios.post(`http://${hostPOV}:3003/collect-user-data`,{id:decodedToken.id})
          let userRole = await axios.get(`http://${hostPOV}:3003/user/${decodedToken.id}`)
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
    return res.status(500).send('Error while validating token!')
  }
});

app.post('/collect-user-data', async(req,res)=>{
  //complete date (user - owned nodes)
  try{
    let userId = req.body.id;
    //user user id from token to find user role
    let userInfo = await axios.get(`http://${hostPOV}:3003/user/${userId}`)
  
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
    return res.status(500).send('Error while collecting user data!')
  }
})

app.get('/all-users', async(req,res)=>{
  try{
    // let allUsers = await axios.get(`http://${hostPOV}:3003/all-users`)
    let allUsers = await axios.get(`http://${hostPOV}:3003/user`)
    return res.status(200).send(JSON.stringify([...allUsers.data]));
  }
  catch(err)
  {
    return res.status(500).send('Error while feetching users!')
  }
})

app.post('/update-fields', async(req,res)=>{
  let userId = undefined;
  try{
    let  availableFields = ['role','email','username'] 
    Object.keys(req.body).forEach((field)=>{
      if(!availableFields.includes(field))
      {
        if(field != 'userId')
        {
          return res.status(400).send(`Wrong format,updating field ${field} is forbidden`)
        }
      }
    })
    userId = req.body.userId
    if(userId == undefined) return res.status(400).send("Wrong format, can't update fields whitout a userId")

    let dbUpdateResp = await axios.post(`http://${hostPOV}:3003/update`,{...req.body})
    return res.status(200).send(JSON.stringify({_id: dbUpdateResp._id}))
  }
  catch(err)
  {
    return res.status(500).send("Error while updating user fields!")
  }
})

app.post('/delete',async(req,res)=>{
  try{
    let {userId} = req.body;
    await axios.delete(`http://${hostPOV}:3003/delete/${userId}`)
    return res.status(200).send({userId})
  }
  catch(err)
  {
    return res.status(500).send("Error while deleting user!")
  }
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
        needsAuth: false,
        roles:[],
        route: 'check-token'
    },
    'collect-user-data_POST':{
        needsAuth: true,
        roles: ['user','admin'],
        route: 'collect-user-data'
    },
    'all-users_GET':{
      needsAuth: true,
      roles: ['admin'],
      route: 'all-users'
    },
    'update-fields_POST':{
      needsAuth: true,
      roles: ['admin'],
      route: 'update-fields'
    },
    'delete_POST':{
      needsAuth: true,
      roles: ['admin'],
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
