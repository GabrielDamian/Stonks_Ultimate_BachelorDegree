// DOCKER SETUP
let hostPOV = 'localhost'
console.log(process.argv[2])
if(process.argv[2] !== undefined)
{
    hostPOV = '172.17.0.1'
}
console.log("HOST POV:", hostPOV)


// LAYERS BUSINESS
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
})
app.get('/fetch-layers',async (req,res)=>{

  console.log("fetch layers")
  
  let token = req.cookies.jwt
  console.log("token:", token)

  let reps_token_check = await axios.post(
    `http://${hostPOV}:3002/check-token`,
    {token}
  )
  console.log("token resp:",reps_token_check.data)

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

})


app.listen(3008,()=>{
    console.log("Layers business is listening at 3008")
})
