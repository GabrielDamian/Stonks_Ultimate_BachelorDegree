// USER BUSINESS
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');

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
    ]
  ]}))


app.post('/login',(req,res)=>{
    console.log("login:", req.body);
    res.send("ok")
})

app.listen(3002,()=>{
    console.log("api gateway is listening at 3002")
})