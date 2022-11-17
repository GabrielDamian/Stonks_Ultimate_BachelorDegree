const express = require('express');
var cors = require('cors');
const axios = require('axios')
const app = express();


app.use(express.json());
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


app.post('/deploy-node',(req,res)=>{

    let {code} = req.body;

    return res.status(200).send("ok deploymen")
})
app.listen(3004,()=>{
    console.log("api gateway is listening at 3004")
})
