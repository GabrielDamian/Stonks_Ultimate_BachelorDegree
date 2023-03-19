const express = require('express');
const app = express();
app.use(express.json());


let hostPOV = 'localhost'
console.log(process.argv[2])
if(process.argv[2] !== undefined)
{
    hostPOV = '172.17.0.1'
}

app.get('/ceva',(req,res)=>{
    res.send("node ok")
})

const port = 3010
app.listen(3010,()=>{
    console.log(`Node is listening at post ${port}`)
})