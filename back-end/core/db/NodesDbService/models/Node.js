const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const nodeSchema = new mongoose.Schema({
    buildName:{ //init
        type: String,
        required: true
    },
    owner:{ //init
        type: String,
        required: true
    },
    description:{ //init
        type: String,
    },
    market:{ //init
        type:String,
        required: true
    },
    code:{
        type: String
    },
    imageId:{
        type: String
    },
    containerId:{
        type: String
    },
    status:{
        type:String
    },
    predictions:[{
        timestamp: String, 
        value: Number, 
    }],
    initTest: {
        mae_test: String,
        mse_test: String,
        rmse_test: String
    }
});

const User = mongoose.model('node', nodeSchema);

module.exports = User;