const express = require('express');
var cors = require('cors');
const axios = require('axios')
const app = express();

//kafka
const { Kafka } = require('kafkajs')
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
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


// app.post('/deploy-code',async (req,res)=>{

//   console.log("deploy code empty")

//   let {code} = req.body;
  
//   console.log("Code:",code)
//   await producer.connect()
//   await producer.send({
//     topic: 'to-balancer',
//     messages: [
//       { value: code },
//     ],
//   })

//   await producer.disconnect()

//   return res.status(200).send({test:'ceva'}) 
// })


//--> Test pursope route //page GET trigger
//TO DELETE
app.post('/deploy-code',async (req,res)=>{

  let {code} = req.body;
  let token = req.cookies.jwt
  console.log("token:", token)

  let reps_token_check = await axios.post(
    "http://localhost:3002/check-token",
    {token}
  )
  console.log("token resp:",reps_token_check.data)
  let ownerId = reps_token_check.data.id;
  console.log("Build owner:", ownerId);

  let frontEndPayload = {
    buildName: 'test name from input field',
    code: code,
    owner: ownerId
  }

  console.log("Code:",code)
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

// Port: 3004 by default !!!! Check dev temp fixes
app.listen(3004,()=>{
    console.log("deployment business at 3004")
})
