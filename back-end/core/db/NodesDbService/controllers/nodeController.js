const Node = require("../models/Node");
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongoose");
require("dotenv").config();
// handle errors

module.exports.create_node = async (req, res) => {

    const {buildName, owner, description, market} = req.body;
    console.log("Create node:", req.body);
    let status = 'Deploy in progress'
    try{
        const node = await Node.create({buildName,owner,status,description,market});
            res.status(201).json({ 
                id: node._id,
            });
    }
    catch(e)
    {
        res.status(400).send({test: "Can't create node!"})
    }
}

module.exports.populate_node = async (req, res) => {
    // -code
    // -imageId (same as folder path)
    // -containerId
    const {docId, code, imageId, containerId} = req.body;

    console.log("->> Update Node doc:",docId, code, imageId, containerId);

    try{
        const doc = await Node.findByIdAndUpdate(
            docId,
            {
                code,
                imageId,
                containerId,
                status: 'deploy completed'
            })
        res.status(200).json({ 
            containerId
        });
    }
    catch(e)
    {
        res.status(400).send({test: "Can't update node!"})
    }
}

module.exports.get_user_nodes = async (req, res) => {
    // /get-user-nodes
    const {owner} = req.body;
    console.log("nodes owner:",owner)

    console.log("->> Owner to extract nodes:",owner);
    try{
        const doc = await Node.find({owner})
        
        console.log("DB resp mongoose:", doc)
        let extractNodesData = []
        doc.forEach((el)=>{
            console.log("iterate:",el)
            console.log("core:", el._id)
            console.log("name:", el.buildName)
            console.log("status:", el.status)
            extractNodesData.push({
                id:el._id,
                buildName: el.buildName,
                status: el.status
            })
        })

        console.log("extraced:",extractNodesData)

        res.status(200).json({ 
            nodes: extractNodesData
        });
    }
    catch(e)
    {
        res.status(400).send({test: "Can't update node!"})
    }
}

module.exports.get_node = async (req, res) => {
    console.log("get node:", req.url)
    let destructureLink = req.url.split('/')
    let extractId = destructureLink[2]
    console.log("extractID:", extractId)
    console.log("extractID:", typeof extractId)
    
    try{
        let nodeDbResp = await Node.findById(extractId);
        console.log("------>nodeDbResp:",nodeDbResp)
        if(nodeDbResp !== null)
        {
            console.log("case 1")
            return res.status(200).send(JSON.stringify(nodeDbResp))
        }
        else 
        {
            console.log("case 2")
            return res.status(404).send("Node don't exist!")
        }
    }
    catch(err)
    {
        return res.status(400).send("Can't find doc id")
    }
    // try{
    //     const doc = await Node.findById(extractId)
    //     console.log("doc find:",doc)
    // }
    // catch(e)
    // {
    //     console.log("can't find node err")
    //     return res.status(400).send({test: "Can't find doc node node!"})
    // }

    return res.status(200).send(JSON.stringify({ceva:'ceva'}))
}

module.exports.push_stats = async (req,res)=>{
    
    let {new_prediction, node_id} = req.body;

    console.log("push stats:", new_prediction, node_id);

    const doc = await Node.findOne({ _id: node_id })

    let complete_stats_element = {
        timestamp: new Date().getTime().toString(), 
        value: Number(new_prediction), 
    }

    try{
        doc.predictions.push(complete_stats_element)
        await doc.save()
        res.status(200).json({ 
            node_id
        });
    }
    catch(err)
    {
        console.log("err:", err)
        res.status(400).send({test: "Can't update node stats!"})
    }
}


module.exports.push_tests = async (req,res)=>{
    
    let {data, node_id} = req.body;

    console.log("data:",data)

    const doc = await Node.findOne({ _id: node_id })


    try{
        data.forEach((el)=>{
            doc.initTests.push(el)
        })
        await doc.save()
        res.status(200).json({ 
            node_id
        });
    }
    catch(err)
    {
        console.log("err:", err)
        res.status(400).send({test: "Can't update node stats!"})
    }
}