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
        return res.status(400).send({test: "Can't create node!"})
    }
}

module.exports.populate_node = async (req, res) => {

    console.log("populate node entry:", req.body);
    
    const {docId, code, imageId, containerId, status} = req.body;

    const checkedObjet ={}
    if(code !== undefined) checkedObjet['code'] = code
    if(imageId !== undefined) checkedObjet['imageId'] = imageId
    if(containerId !== undefined) checkedObjet['containerId'] = containerId
    if(status !== undefined) checkedObjet['status'] = status

    try{
        const doc = await Node.findByIdAndUpdate(
            docId,
            {
                ...checkedObjet
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

        return res.status(200).json({ 
            nodes: extractNodesData
        });
    }
    catch(e)
    {
        return res.status(400).send({test: "Can't update node!"})
    }
}

module.exports.get_node = async (req, res) => {
    let extractId = req.params.id;

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

}

module.exports.push_stats = async (req,res)=>{
    let {new_prediction, node_id} = req.body;

    const doc = await Node.findOne({ _id: node_id })
    
    const currentTimeStamp = new Date();
    const tomorrowTimeStamp = new Date(currentTimeStamp.getTime() + 24 * 60 * 60 * 1000);

    let complete_stats_element = {
        timestamp: tomorrowTimeStamp.getTime().toString(), 
        value: Number(new_prediction), 
    }
    try{
        doc.predictions.push(complete_stats_element)
        await doc.save()
        return res.status(200).json({ 
            node_id
        });
    }
    catch(err)
    {
        return res.status(400).send({test: "Can't update node stats!"})
    }
}

module.exports.push_tests = async (req, res) => {
    let { mae_test, mse_test, rmse_test, node_id } = req.body;
    try {
      const doc = await Node.findOne({ _id: node_id });
     
      doc.initTest = {
        mae_test,
        mse_test,
        rmse_test
      };
  
      await doc.save();
      return res.status(200).json({ 
        node_id 
    });

    } catch (err) {
      return res.status(400).send({ error: "Can't update node stats!" });
    }
};

module.exports.delete = async(req,res)=>{
    try{
        let nodeId = req.params.id;
        console.log("To delete:", nodeId);

        let deleteResponse = await Node.findOneAndDelete({_id: nodeId});
        return res.status(200).send({_id: nodeId})
    }
    catch(err)
    {
      return res.status(400).send({ error: "Can't delete node!" });
    }
}

module.exports.all_nodes = async (req,res)=>{
    try{
        const doc = await Node.find({})
        
        let extractNodesData = []
        doc.forEach((el)=>{
            extractNodesData.push({
                id:el._id,
                containerId: el.containerId,
            })
        })

        return res.status(200).json({ 
            nodes: extractNodesData
        });
    }
    catch(e)
    {
        return res.status(400).send({test: "Can't update node!"})
    }
}