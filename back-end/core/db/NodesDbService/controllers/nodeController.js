const Node = require("../models/Node");
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongoose");
require("dotenv").config();
// handle errors

module.exports.create_node = async (req, res) => {

    const {buildName, owner, description, market} = req.body;
    let status = 'Status: InProgress'
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
    console.log("populate_node:");
    // -code
    // -imageId (same as folder path)
    // -containerId
    const {docId, code, imageId, containerId, status} = req.body;

    console.log("docId:", docId)
    console.log("imageId:", imageId)
    console.log("containerId:", containerId)
    console.log("status:", status)

    const checkedObjet ={}
    // if(docId !== undefined) checkedObjet['docId'] = docId
    if(code !== undefined) checkedObjet['code'] = code
    if(imageId !== undefined) checkedObjet['imageId'] = imageId
    if(containerId !== undefined) checkedObjet['containerId'] = containerId
    if(status !== undefined) checkedObjet['status'] = status

    console.log("checked object:",checkedObjet)

    try{
        const doc = await Node.findByIdAndUpdate(
            docId,
            {
                ...checkedObjet
                // code,
                // imageId,
                // containerId,
                // status: 'deploy completed'
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
    try{
        const doc = await Node.find({owner})
        
        let extractNodesData = []
        doc.forEach((el)=>{
            extractNodesData.push({
                id:el._id,
                buildName: el.buildName,
                status: el.status
            })
        })

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
    let destructureLink = req.url.split('/')
    let extractId = destructureLink[2]
    
    try{
        let nodeDbResp = await Node.findById(extractId);
        if(nodeDbResp !== null)
        {
            return res.status(200).send(JSON.stringify(nodeDbResp))
        }
        else 
        {
            return res.status(404).send("Node don't exist!")
        }
    }
    catch(err)
    {
        return res.status(400).send("Can't find doc id")
    }

    return res.status(200).send(JSON.stringify({ceva:'ceva'}))
}

module.exports.push_stats = async (req,res)=>{
    
    let {new_prediction, node_id} = req.body;

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
        res.status(400).send({test: "Can't update node stats!"})
    }
}


module.exports.push_tests = async (req,res)=>{
    
    let {data, node_id} = req.body;

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
        res.status(400).send({test: "Can't update node stats!"})
    }
}