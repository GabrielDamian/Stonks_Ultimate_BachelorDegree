// USER BUSINESS
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.get('/test',(req,res)=>{
    res.send("ok")
})

app.listen(3001,()=>{
    console.log("api gateway is listening at 3001")
})