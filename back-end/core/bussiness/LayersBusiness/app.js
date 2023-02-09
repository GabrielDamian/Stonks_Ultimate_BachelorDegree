// USER BUSINESS
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
    let token = req.cookies.jwt
    console.log("token:", token)
  
    let reps_token_check = await axios.post(
      "http://localhost:3002/check-token",
      {token}
    )
    let userId = reps_token_check.data.id;
    let userInfo = await axios.post("http://localhost:3003/collect-user-data",{id:userId});

    console.log("user info:", userInfo);


    console.log("token resp:",reps_token_check.data)
    res.send('test create layer')

})
app.get('/fetch-layers',async (req,res)=>{
 
    let token = req.cookies.jwt
    console.log("token:", token)
  
    let reps_token_check = await axios.post(
      "http://localhost:3002/check-token",
      {token}
    )
    console.log("token resp:",reps_token_check.data)

    // try{
    //     let resp_user_nodes = await axios.post(
    //         "http://localhost:3005/get-user-nodes",
    //         {owner:ownerId}
    //     )
    //    console.log("db service nodes resp:",resp_user_nodes.data)
    //    let extractedResponse = {...resp_user_nodes.data}
    //    console.log("Final chekc:",extractedResponse)
    //    return res.status(200).send(JSON.stringify({...extractedResponse}))
    // }
    // catch(e)
    // {
    //     console.log("err:")
    //     return res.status(403).send("Can't get user nodes!")
    // }

})


app.listen(3008,()=>{
    console.log("Layers business is listening at 3008")
})
