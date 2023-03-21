//BUSINESS DEPLOYMENT SERVICE


// DOCKER SETUP
let hostPOV = 'localhost'
if(process.argv[2] !== undefined)
{
    hostPOV = '172.17.0.1'
}

const express = require('express');
var cors = require('cors');
const axios = require('axios')
const app = express();

//kafka
const { Kafka } = require('kafkajs')
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [`${hostPOV}:9092`],
})
const producer = kafka.producer()
const cookieParser = require("cookie-parser");

app.use(cookieParser());
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


app.post('/deploy-code',async (req,res)=>{

  let {code,name,description,market} = req.body;
  let token = req.cookies.jwt

  let reps_token_check = await axios.post(
    `http://${hostPOV}:3002/check-token`,
    {token}
  )
  let ownerId = reps_token_check.data.id;

  let frontEndPayload = {
    buildName: name,
    code: code,
    description: description,
    market: market,
    owner: ownerId
  }
  
  await producer.connect()
  await producer.send({
    topic: 'to-balancer',
    messages: [
      { value:  JSON.stringify(frontEndPayload)},
    ],
  })

  await producer.disconnect()
  return res.status(200).send({test:'ceva'}) 
})

app.get('/test',(req,res)=>{
  return res.send('deployment business node ok')
})

app.listen(3004,()=>{
    console.log("Deployment Business Service at port 3004")
})
