// USER BUSINESS
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const axios = require('axios')

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
    ]
  ]}))

app.get('/fetch-nodes',async (req,res)=>{
 
    let token = req.cookies.jwt
    console.log("token:", token)
  
    let reps_token_check = await axios.post(
      "http://localhost:3002/check-token",
      {token}
    )
    console.log("token resp:",reps_token_check.data)
    let ownerId = reps_token_check.data.id;
    console.log("Nodes owner:", ownerId);

    try{
        let resp_user_nodes = await axios.post(
            "http://localhost:3005/get-user-nodes",
            {owner:ownerId}
        )
       console.log("db service nodes resp:",resp_user_nodes.data)
       let extractedResponse = {...resp_user_nodes.data}
       console.log("Final chekc:",extractedResponse)
       return res.status(200).send(JSON.stringify({...extractedResponse}))
    }
    catch(e)
    {
        console.log("err:")
        return res.status(403).send("Can't get user nodes!")
    }

})
app.listen(3006,()=>{
    console.log("api gateway is listening at 3001")
})