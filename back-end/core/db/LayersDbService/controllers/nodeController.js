const Layer = require("../models/Layer");
const { ObjectId } = require("mongoose");
const {convertIntoPythonCode} = require('../utils.js')

require("dotenv").config();

module.exports.create_layer = async (req, res) => {

    
    // convertIntoPythonCode(req.body)
    let {
        layerName,
        layerKeyword,
        layerDescription,
        docLink,
        parameters
    } = req.body;

    console.log("parameters:", parameters)
    let layerResp = undefined;
    try{
        layerResp = await Layer.create({layerName,layerKeyword,layerDescription,docLink});
        console.log("layer created ok:", layerResp._id)
    }
    catch(e)
    {
        console.log(e)
        return res.status(400).send({test: "Can't create layer!"})
    }

    try
    {
        const layerCreated = await Layer.findOne({ _id: layerResp._id })
        parameters.forEach((parameterEl)=>{
            layerCreated.parameters.push(parameterEl);
        })
        layerCreated.save()
    }
    catch(e)
    {
        console.log(e)
        return res.status(400).send({test: "Can't setup layer parameters!"})
    }

    res.send("ceva")

}

module.exports.get_layers = async(req,res)=>{

    try{
        const doc = await Layer.find({})
        console.log("doc:",doc)

        res.status(200).json({layers: doc});
    }
    catch(e)
    {
        res.status(400).send({test: "Can't fetch layers"})
    }
}