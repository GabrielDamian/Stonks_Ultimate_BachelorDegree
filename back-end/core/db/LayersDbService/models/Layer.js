const mongoose = require('mongoose');
const layerSchema = new mongoose.Schema({
    layerName: String,
    layerKeyword: String, 
    layerDescription: String, 
    docLink: String, 
    parameters:[{

        paramName: String, //user display name
        parameterKeyword: String, //parameter name in code
        parameterDescription: String,
        unnamed: String, //"unnamed" || "named",
        parameterValues:[
            {
                typeParam: String, //string || value
                value: String
            }
        ]
    }]
});

const Layer = mongoose.model('layer', layerSchema);

module.exports = Layer;