const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const nodeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    }
}
);
const User = mongoose.model('node', nodeSchema);

module.exports = User;