const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const nodeSchema = new mongoose.Schema({
    buildName:{
        type: String,
        required: true
    },
    owner:{
        type: String,
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
    }
});

const User = mongoose.model('node', nodeSchema);

module.exports = User;