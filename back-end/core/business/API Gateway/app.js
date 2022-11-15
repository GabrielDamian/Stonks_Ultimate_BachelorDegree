// API GATEWAY
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const morgan = require("morgan");

const app = express();
const setupLogging = (app) => {
    app.use(morgan('combined'));
}

app.use(express.json());
app.use(cookieParser());
app.use(cors());
setupLogging(app);

const ROUTES = {
    'login':{
        // TODO
        // method: 'POST',
        needsAuth: false,
    },
    'dashboard':{
        needsAuth: true,
    }
}

app.get('/:destination',(req,res)=>{
    console.log("original url:", req.originalUrl)
    let url = req.originalUrl.slice(1)
    if(ROUTES[url])
    {
        res.send("ruta exista")
    }
    else 
    {
        res.status(404).send("404")
    }
})

app.listen(3001,()=>{
    console.log("api gateway is listening at 3001")
})