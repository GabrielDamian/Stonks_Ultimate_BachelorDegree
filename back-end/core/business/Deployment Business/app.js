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
app.get('/deploy-code',async (req,res)=>{

  // let {code} = req.body;
  let code = `from flask import Flask
from flask_apscheduler import APScheduler
import datetime

app = Flask(__name__)

def my_job(text):
    print(text, str(datetime.datetime.now()))

@app.route('/')
def index():
    #
    #
    return 'Web App with Python Flask!'

if (__name__ == "__main__"):
    scheduler = APScheduler()
    scheduler.add_job(func=my_job, args=['job run'], trigger='interval', id='job', seconds=5)
    scheduler.start()
    app.run(host='0.0.0.0', port=81)
  `

  let frontEndPayload = {
    name: 'test name',
    code: code
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
