const Layer = require("../models/Layer");

require("dotenv").config();

module.exports.create_layer = async (req, res) => {

    let {
        layerData,
        parameters
    } = req.body;

    let layerName = layerData.name;
    let layerKeyword = layerData.keyword;
    let layerDescription = layerData.desc;
    let docLink = layerData.docLink;
    let iconLink = layerData.iconLink;

    let layerResp = undefined;
    try{
        layerResp = await Layer.create({layerName,layerKeyword,layerDescription,docLink, iconLink});
    }
    catch(e)
    {
        return res.status(400).send({test: "Can't create layer!"})
    }
    let layerCreated = undefined;
    try
    {
        layerCreated = await Layer.findOne({ _id: layerResp._id })
        parameters.forEach((parameterEl)=>{

            let parameter_values = ""
            let interSeparator = "--"
            let externalSeparator = "___"
            parameterEl.values.forEach((parameter_value_el, index)=>{
                parameter_values += parameter_value_el.type + interSeparator + parameter_value_el.value
                if(index !== parameterEl.values.length  - 1)
                {
                    parameter_values += externalSeparator;
                }
            })

            parameterEl.parameterValues = parameter_values
            layerCreated.parameters.push(parameterEl);
        })
        layerCreated.save()
    }
    catch(e)
    {
        return res.status(400).send({test: "Can't setup layer parameters!"})
    }

    res.status(200).send({_id: layerCreated['_id']})
}

module.exports.get_layers = async(req,res)=>{

    try{
        const doc = await Layer.find({})

        res.status(200).json({layers: doc});
    }
    catch(e)
    {
        res.status(400).send({test: "Can't fetch layers"})
    }
}