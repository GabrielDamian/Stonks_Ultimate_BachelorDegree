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


app.get('/deploy-node',async (req,res)=>{

    // let {code} = req.body;
    //test 
    let code = "TEst code example"
    console.log("Code:",code)
    await producer.connect()
    await producer.send({
      topic: 'to-balancer',
      messages: [
        { value: "ceva" },
      ],
    })

    await producer.disconnect()

    return res.status(200).send("ok deploymen")
})
app.listen(3004,()=>{
    console.log("api gateway is listening at 3004")
})
