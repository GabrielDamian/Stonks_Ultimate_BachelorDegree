const express = require("express")
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:2717/auth') //create 'auth' database if doesn't exists


app.get('/',(req,res)=>{
    res.send('test')
})

app.post('/signup',async (req,res)=>{
    console.log("signup:", req.body);
    try{
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        console.log("return ok")
        return res.json({status:'ok'})
    }
    catch(e)
    {
        console.log("/signp error:",e)
        return res.json({
            status: 'error',error:'duplicate email'
        })
    }
})
app.post('/login',async (req,res)=>{
    console.log("login:", req.body);

    const user = await User.findOne({
        name: req.body.email,
        password: req.body.password
    })

    console.log("user:", user)
    if(user)
    {
        const token = jwt.sign({
            email: req.body.email
        },'secret123')

        return res.json({status: 'ok', token: token})
    }
    else 
    {
        return res.json({status: 'failed'})
    }
})

app.post('/check-token',(req,res)=>{

    console.log("token:", req.body.token);

    let decode = null;
    try{
      decode = jwt.verify(req.body.token,'secret123')
    }
    catch(e)
    {
        console.log("err:", e)
    }
    console.log("decode:", decode)
    res.send({ceva:'ceva'})
})

app.listen(1337, ()=>{
    console.log("app is running on 1337");
})