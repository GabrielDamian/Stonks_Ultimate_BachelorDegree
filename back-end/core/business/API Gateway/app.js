// API GATEWAY
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const morgan = require("morgan");
const axios = require('axios')
const  { Proxy } = require('axios-express-proxy');
const app = express();
const setupLogging = (app) => {
    app.use(morgan('combined'));
}

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
// setupLogging(app);

const ROUTES = {
    'login_POST':{
        needsAuth: false,
        roles: [],
        service: "http://localhost:3002/login"
    },
    'signup_POST':{
        needsAuth: false,
    },
}
let mapIndexSeparator = "_";

app.post('/:destination',async (req,res)=>{
    let url = req.originalUrl.slice(1)
    let method = req.method;

    let mapIndex = url + mapIndexSeparator + method; 

    if(ROUTES[mapIndex])
    {
        // TODO:
        if(ROUTES[mapIndex].needsAuth == true)
        {
            let token = req.cookies.jwt;
            if(!token)
            {
                return res.status(401).send("Please provide a token!")
            }
            console.log("ceva:")
            try{
                let reps_token_check = await axios.post(
                    "http://localhost:3003/check-token",
                    {token}
                )
               console.log(reps_token_check.data)
            }
            catch(e)
            {
                console.log("err:")
                return res.send(403).send("Wrong token!")
            }
           
        }
        return Proxy(ROUTES[mapIndex].service, req, res)

        // console.log("SKIP auth")
        // let resp = await axios({
        //     method: method,
        //     url: ROUTES[mapIndex].service,
        //     data: {...req.body}
        //   });
        //   console.log("RESP:",resp)
        
    }
    else 
    {
        res.status(404).send("404")
    }
})

app.listen(3001,()=>{
    console.log("api gateway is listening at 3001")
})