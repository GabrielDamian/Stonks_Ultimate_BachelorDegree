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

app.get('/fetch-node',async(req,res)=>{
  let nodeId = req.query.nodeid;
  console.log("nodeID:",nodeId)

  let token = req.cookies.jwt
    console.log("token:", token)
  
    let reps_token_check = await axios.post(
      "http://localhost:3002/check-token",
      {token}
    )
    console.log("token resp:",reps_token_check.data)
    let ownerId = reps_token_check.data.id;
    console.log("Nodes owner:", ownerId);

    let nodeBdResp = null
    try{
       let nodeBd = await axios.get(
        `http://localhost:3005/get-node/${nodeId}`,
      )
      nodeBdResp = nodeBd.data;
    }
    catch(err)
    {
      return res.status(404).send("Can't find node")
    }

    if(nodeBdResp !== null && nodeBdResp.owner == ownerId)
    {
      return res.status(200).send(JSON.stringify(nodeBdResp))
    }
    else 
    {
      return res.status(403).send("You can't fetch this node");
    }
})

app.post('/establish-node-connection',async (req,res)=>{
  console.log("------>establish-connection entry point")
  let nodeId = req.body.nodeID;
  console.log("nodeID:",nodeId)

  let token = req.cookies.jwt
    console.log("token:", token)
  
    let reps_token_check = await axios.post(
      "http://localhost:3002/check-token",
      {token}
    )
    console.log("token resp:",reps_token_check.data)
    let ownerId = reps_token_check.data.id;
    console.log("Nodes owner:", ownerId);

    let nodeBdResp = null
    try{
       let nodeBd = await axios.get(
        `http://localhost:3005/get-node/${nodeId}`,
      )
      nodeBdResp = nodeBd.data;
    }
    catch(err)
    {
      return res.status(404).send("Can't find node")
    }

    if(nodeBdResp !== null && nodeBdResp.owner == ownerId)
    {
      console.log("nodeBdResp ok:",nodeBdResp)
      //execute docker inspect and find out port to connect to node
      let containerID = nodeBdResp.containerId;
      console.log("containerID:",containerID)
      exec(`docker inspect ${containerID}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log("stdout->>>:",  stdout)
        // let parseOutput = JSON.parse(stdout[0])
        // console.log("here--->:",parseOutput)
        let extractJson = stdout.substr(1).slice(0, -2) .trim()

        let parsedJson= JSON.parse(extractJson)

        let address = parsedJson["NetworkSettings"]["IPAddress"]
        console.log("final:",address)
        
        let responsePacket = {
          status: address == ""?false:true,
          address: address
        }

        return res.status(200).send(responsePacket)
    });
    }
    else 
    {
      return res.status(403).send("You can't fetch this node");
    }
})

app.post('/push-node-stats',async (req,res)=>{
  
  console.log("push node stats")
  let {node_id, new_prediction} = req.body;

  

  console.log("test params:", node_id, new_prediction)
  // return res.status(200).send('ceva')
  try{
    
    let push_stats_resp = await axios.post(
      `http://localhost:3005/push-stats`,
        {
          new_prediction,
          node_id
        }
    )

   let extractedResponse = {...push_stats_resp.data}
   return res.status(200).send(JSON.stringify({...extractedResponse}))

  }
  catch(e)
  {
      console.log("err:",e)
      return res.status(403).send("Can't push node stats!")
  }
})

app.post('/push-node-training',async (req,res)=>{
  console.log("push node stats")
  let {node_id, intervals,values} = req.body;

  console.log("push-node-training:",node_id, intervals, values);
  let pairs = []
  intervals.forEach((el,index)=>{
    pairs.push({
      interval: el,
      value: values[index]
    })
  })

  console.log("pairs:",pairs);
  try{
    
    let push_stats_resp = await axios.post(
      `http://localhost:3005/push_tests`,
        {
          data: pairs,
          node_id: node_id
        }
    )

   let extractedResponse = {...push_stats_resp.data}
   return res.status(200).send(JSON.stringify({...extractedResponse}))

  }
  catch(e)
  {
      console.log("err:",e)
      return res.status(403).send("Can't push node stats!")
  }

})


app.listen(3006,()=>{
    console.log("api gateway is listening at 3006")
})
