//LAYERS BUSINESS SERVICE

// DOCKER SETUP
let hostPOV = 'localhost'
const SERVER_ADDRESS = 3008
const service_id = "Layers Business"

if(process.argv[2] !== undefined)
{
    hostPOV = '172.17.0.1'
}
console.log("HOST POV:", hostPOV)


const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const axios = require('axios')
const { exec } = require("child_process");
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
      "http://localhost:3007",
    ]
  ]}))

app.post('/create-layer', async(req,res)=>{
  try{
    let layerData = req.body.layerData
    let parameters = req.body.parameters
    let token = req.cookies.jwt
    let reps_token_check = await axios.post(
      `http://${hostPOV}:3002/check-token`,
      {token}
    )

    if(reps_token_check.data.role !== undefined && reps_token_check.data.role == 'admin')
    {
      try{
        let create_layers_response = await axios.post(
          `http://${hostPOV}:3007/create-layer`,
          {
            layerData,
            parameters
          }
        )
        return res.status(200).send({...create_layers_response.data})
      }
      catch(e)
      {
        return res.status(500).send("can't create a new layer")
      }
    }
    else 
    {
      return res.status(403).send("You don't have rights to create new layer!")
    }
  }
  catch(err)
  {
    next(err);
  }
    
})
app.get('/fetch-layers',async (req,res)=>{
  try{
    let token = req.cookies.jwt

    let reps_token_check = await axios.post(
      `http://${hostPOV}:3002/check-token`,
      {token}
    )
  
    try{
      let get_layers_response = await axios.get(
        `http://${hostPOV}:3007/get-layers`,
      )
      return res.status(200).send({...get_layers_response.data})
    }
    catch(e)
    {
      return res.status(500).send("can't get layers")
    }
  }
  catch(err)
  {
    next(err);
  }
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(SERVER_ADDRESS,()=>{
    console.log(`Layers Business Service at port ${SERVER_ADDRESS}`)
})

// API GATEWAY LOGIC
const SubscribeAction = async ()=>{
  function sleep(milliseconds) {  
    return new Promise(resolve => setTimeout(resolve, milliseconds));  
} 
  const resources = {
    'create-layer_POST':{
      needsAuth: true,
      roles: [],
      route: 'create-layer'
  },
  'fetch-layers_GET':{
      needsAuth: true,
      roles: [],
      route: 'fetch-layers'
  }
  }
  let status_subscribe = false;
  while(!status_subscribe)
  {
    await sleep(1000);
    try{
      await axios.post(`http://${hostPOV}:3001/subscribe`,{
        service_id,
        SERVER_ADDRESS,
        resources
      })
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
