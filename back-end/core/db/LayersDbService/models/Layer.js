const mongoose = require('mongoose');
const layerSchema = new mongoose.Schema({
    layerName: String,
    layerKeyword: String, 
    layerDescription: String, 
    docLink: String, 
    iconLink: String,
    parameters:[{

        paramName: String, 
        paramKeyword: String, //parameter name in code
        paramDesc: String,
        unnamed: String,//true || false
        parameterValues: String //concated String ex: "String--22___String--sdsd"
    }]
});

const Layer = mongoose.model('layer', layerSchema);

module.exports = Layer;