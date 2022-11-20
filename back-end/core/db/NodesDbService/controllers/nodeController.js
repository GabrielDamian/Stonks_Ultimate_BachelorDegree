const Node = require("../models/Node");
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongoose");
require("dotenv").config();
// handle errors

module.exports.create_node = async (req, res) => {

    //more fields needed (market, createdAt...)
    const {name} = req.body;
    
    try{
        const node = await Node.create({name});
            res.status(201).json({ 
            id: node._id,
            });
    }
    catch(e)
    {
        res.status(400).send({test: "can't creade node!"})
    }
//`TODO: create node

//   const { email, password,username } = req.body;

//   try {
//     const user = await User.create({ email, password, username });
//     res.status(201).json({ 
//       user: user._id,
//     });
//   }
//   catch(err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }
 
}

