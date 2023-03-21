// API GATEWAY SERVICE


// DOCKER SETUP
let hostPOV = 'localhost'
if(process.argv[2] !== undefined)
{
    hostPOV = '172.17.0.1'
}
console.log("HOST POV:", hostPOV)

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

const ROUTES = {
    //user business layer
    'login_POST':{
        needsAuth: false,
        roles: [],
        service: `http://${hostPOV}:3002/login`
        
    },
    'signup_POST':{
        needsAuth: false,
        roles: [],
        service: `http://${hostPOV}:3002/signup`
    },
    'check-token_POST':{
        needsAuth: true,
        roles:[],
        service: `http://${hostPOV}:3002/check-token`
    },
    'collect-user-data_POST':{
        needsAuth: true,
        roles: [],
        service: `http://${hostPOV}:3002/collect-user-data`
    },
    //deployment business layer
    'deploy-code_POST':{
        needsAuth: true,
        roles:[],
        service: `http://${hostPOV}:3004/deploy-code`
    },
    //fetch nodes
    'fetch-nodes_GET':{
        needsAuth: true,
        roles:[],
        service: `http://${hostPOV}:3006/fetch-nodes`
    },
    'fetch-node_GET':{
        needsAuth: true,
        roles:[],
        service: `http://${hostPOV}:3006/fetch-node`
    },
    'establish-node-connection_POST':{
        needsAuth: true,
        roles:[],
        service: `http://${hostPOV}:3006/establish-node-connection`
    },
    'create-layer_POST':{
        needsAuth: true,
        roles:[],
        service: `http://${hostPOV}:3008/create-layer`
    },
     'fetch-layers_GET':{
        needsAuth: true,
        roles:[],
        service: `http://${hostPOV}:3008/fetch-layers`
    },

    // block layers


}
let mapIndexSeparator = "_";
app.get('/test',(req,res)=>{
    return res.send("node ok")
})
app.post('/:destination',async (req,res)=>{

    let url = req.originalUrl.slice(1)
    let method = req.method;

    let mapIndex = url + mapIndexSeparator + method; 
    if(ROUTES[mapIndex])
    {
        
        if(ROUTES[mapIndex].needsAuth == true)
        {
            let token = req.cookies.jwt;
            if(!token)
            {
                return res.status(401).send("Please provide a token!")
            }
            try{
                let reps_token_check = await axios.post(
                    `http://${hostPOV}:3002/check-token`,
                    {token}
                )
            }
            catch(e)
            {
                console.log("err:")
                return res.status(403).send("Wrong token!")
            }
           
        }
        try{
            Proxy(ROUTES[mapIndex].service, req, res)
            .then((el)=>{
                return el
            })
            .catch((err)=>{
                return res.status(err.response.status).send(JSON.stringify(err.response.data))
            })
        }
        catch(e)
        {
            console.log("err:",e)
        }
    }
    else 
    {
        console.log("Route not found:", 404)
        res.status(404).send("404")
    }
})
app.get('/:destination',async (req,res)=>{

    //check if link contains query params
    let testSplitQueryParams = req.originalUrl.slice(1).split("?")
    let url = testSplitQueryParams[0]
    let queryParamsPayload = "/?"
    if(testSplitQueryParams.length>1)
    {
        queryParamsPayload += testSplitQueryParams[1]
    }
    if(url[url.length-1] == '/')
    {
        url = url.slice(0,-1)
    }
    
    let method = req.method;

    let mapIndex = url + mapIndexSeparator + method; 
    if(ROUTES[mapIndex])
    {
        if(ROUTES[mapIndex].needsAuth == true)
        {
            let token = req.cookies.jwt;
            if(!token)
            {
                return res.status(401).send("Please provide a token!")
            }
            try{
                let reps_token_check = await axios.post(
                    `http://${hostPOV}:3002/check-token`,
                    {token}
                )
            }
            catch(e)
            {
                console.log("403")
                return res.status(403).send("Wrong token!")
            }
           
        }
        try{
            let attachQueryPayload = ROUTES[mapIndex].service + queryParamsPayload

            Proxy(attachQueryPayload, req, res)
            .then((el)=>{
                return el
            })
            .catch((err)=>{
                console.log("err:",err)
                return res.status(err.response.status).send(JSON.stringify(err.response.data))
            })
        }
        catch(e)
        {
            console.log("err:",e)
        }
    }
    else 
    {
        console.log("Err 404")
        res.status(404).send("404")
    }
})

app.listen(3001,()=>{
    console.log("aaaapi gateway is listening at 3001")
})