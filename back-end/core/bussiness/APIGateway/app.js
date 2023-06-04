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


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
        [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "http://localhost:3003"
        ]
]}))

const ROUTES = {
    //user business layer
    // 'login_POST':{
    //     needsAuth: false,
    //     roles: [],
    //     service: `http://${hostPOV}:3002/login`
        
    // },
    // 'signup_POST':{
    //     needsAuth: false,
    //     roles: [],
    //     service: `http://${hostPOV}:3002/signup`
    // },
    // 'check-token_POST':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3002/check-token`
    // },
    // 'collect-user-data_POST':{
    //     needsAuth: true,
    //     roles: [],
    //     service: `http://${hostPOV}:3002/collect-user-data`
    // },
    //deployment business layer

    // 'deploy-code_POST':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3004/deploy-code`
    // },

    //nodes
    // 'fetch-nodes_GET':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3006/fetch-nodes`
    // },
    // 'fetch-node_GET':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3006/fetch-node`
    // },
    // 'establish-node-connection_POST':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3006/establish-node-connection`
    // },
    // // TODO: the next 2 routes are not used thourgh the gateway, fix them
    // 'push-node-stats_POST':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3006/push-node-stats`
    // },
    // 'push-node-training_POST':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3006/push-node-training`
    // },


    //layers
    // 'create-layer_POST':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3008/create-layer`
    // },
    //  'fetch-layers_GET':{
    //     needsAuth: true,
    //     roles:[],
    //     service: `http://${hostPOV}:3008/fetch-layers`
    // },

}
const mapIndexSeparator = "_";

app.post('/subscribe',(req,res)=>{
    console.log("subscriube route")

    const  {service_id,resources,SERVER_ADDRESS} = req.body;

    let resources_stage = {}
    Object.keys(resources).map((el)=>{
        let local_el = {...resources[el]}
        local_el['service'] = `http://${hostPOV}:${SERVER_ADDRESS}/${resources[el].route}`
        delete local_el['route']

        local_el['service_id'] = service_id
        local_el['last_heart_beat'] = new Date()
        resources_stage[el] = {...local_el}
    })

    Object.keys(resources_stage).forEach((el)=>{
        ROUTES[el] = {...resources_stage[el]}
        
    })

    res.status(200).send("subscribe ok")
})

app.post('/heart-beat',(req,res)=>{
    
    console.log("heart beat route")

    let {service_id} = req.body;

    Object.keys(ROUTES).forEach((el)=>{
        if(ROUTES[el]["service_id"] == service_id)
        {
            ROUTES[el].last_heart_beat = new Date()
        }
    })
    return res.status(200).send("ok heart beat")
})

// REDIRECT LOGIC
app.post('/:destination',async (req,res)=>{
    try{
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
    }
    catch(err)
    {
        res.status(500).send('Something broke!')
    }
})
app.get('/:destination',async (req,res)=>{
    try{
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
    }
    catch(err)
    {
        res.status(500).send('Something broke!')
    }
    
})

//HEART BEAT LOGIC 
const CleanServices = ()=>{
    const maxAge = 10000 //10s

    Object.keys(ROUTES).forEach((el)=>{
        let currentTime = new Date()
        let diff = currentTime.getTime() - ROUTES[el]['last_heart_beat']
        if(diff > maxAge)
        {
            delete ROUTES[el]
        }
    })
}
setInterval(()=>{
    CleanServices()
},1000)

setInterval(()=>{
    console.log("-----check:",ROUTES);
},2000)

// START SERVER
app.listen(3001,()=>{
    console.log("aaaapi gateway is listening at 3001")
})


