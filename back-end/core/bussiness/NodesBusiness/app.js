//NODE BUSINESS

// DOCKER SETUP
let hostPOV = "localhost";
const SERVER_ADDRESS = 3006;
const service_id = "Node Business";

if (process.argv[2] !== undefined) {
  hostPOV = "172.17.0.1";
}
console.log("HOST POV:", hostPOV);

const express = require("express");
const cookieParser = require("cookie-parser");
var cors = require("cors");
const axios = require("axios");
const { exec } = require("child_process");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [
      [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://localhost:3006",
      ],
    ],
  })
);

app.get("/fetch-nodes", async (req, res) => {
  try{
    let token = req.cookies.jwt;
    let reps_token_check = await axios.post(
      `http://${hostPOV}:3002/check-token`,
      { token }
    );
    let ownerId = reps_token_check.data.id;
  
    try {
      let resp_user_nodes = await axios.post(
        `http://${hostPOV}:3005/get-user-nodes`,
        { owner: ownerId }
      );
      let extractedResponse = { ...resp_user_nodes.data };
      return res.status(200).send(JSON.stringify({ ...extractedResponse }));
    } catch (e) {
      console.log("err:", e);
      return res.status(403).send("Can't get user nodes!");
    }
  }
  catch(err)
  {
    next(err);
  }
  
});

app.get("/fetch-node", async (req, res) => {
  try{
    let nodeId = req.query.nodeid;
    let token = req.cookies.jwt;
  
    let reps_token_check = await axios.post(
      `http://${hostPOV}:3002/check-token`,
      { token }
    );
    let ownerId = reps_token_check.data.id;
  
    let nodeBdResp = null;
    try {
      let nodeBd = await axios.get(`http://${hostPOV}:3005/get-node/${nodeId}`);
      nodeBdResp = nodeBd.data;
    } catch (err) {
      return res.status(404).send("Can't find node");
    }
  
    if (nodeBdResp !== null && nodeBdResp.owner == ownerId) {
      return res.status(200).send(JSON.stringify(nodeBdResp));
    } else {
      return res.status(403).send("You can't fetch this node");
    }
  }
  catch(err)
  {
    next(err);
  }
  
});

app.post("/establish-node-connection", async (req, res) => {
  try{
    let nodeId = req.body.nodeID;
    let token = req.cookies.jwt;
    let reps_token_check = await axios.post(
      `http://${hostPOV}:3002/check-token`,
      { token }
    );
    let ownerId = reps_token_check.data.id;
  
    let nodeBdResp = null;
    try {
      let nodeBd = await axios.get(`http://${hostPOV}:3005/get-node/${nodeId}`);
      nodeBdResp = nodeBd.data;
    } catch (err) {
      return res.status(404).send("Can't find node");
    }
  
    if (nodeBdResp !== null && nodeBdResp.owner == ownerId) {
      //execute docker inspect and find out port to connect to node
      let containerID = nodeBdResp.containerId;
      exec(`docker inspect ${containerID}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        let extractJson = stdout.substr(1).slice(0, -2).trim();
  
        let parsedJson = JSON.parse(extractJson);
  
        let address = parsedJson["NetworkSettings"]["IPAddress"];
  
        let responsePacket = {
          status: address == "" ? false : true,
          address: address,
        };
  
        return res.status(200).send(responsePacket);
      });
    } else {
      return res.status(403).send("You can't fetch this node");
    }
  }
  catch(err)
  {
    next(err);
  }
  
});

app.post("/push-node-stats", async (req, res) => {
  try{
    let { node_id, new_prediction } = req.body;

    try {
      let push_stats_resp = await axios.post(
        `http://${hostPOV}:3005/push-stats`,
        {
          new_prediction,
          node_id,
        }
      );
  
      let extractedResponse = { ...push_stats_resp.data };
      return res.status(200).send(JSON.stringify({ ...extractedResponse }));
    } catch (e) {
      console.log("err:", e);
      return res.status(403).send("Can't push node stats!");
    }
  }
  catch(err)
  {
    next(err);
  }
  
});

app.post("/push-node-training", async (req, res) => {
  try{
    let { node_id, mae_test, mse_test, rmse_test } = req.body;

    // let pairs = [];
    // intervals.forEach((el, index) => {
    //   pairs.push({
    //     interval: el,
    //     value: values[index],
    //   });
    // });
    
    try {
      let push_stats_resp = await axios.post(
        `http://${hostPOV}:3005/push_tests`,
        {
          mae_test,
          mse_test,
          rmse_test,
          node_id
        }
      );
  
      let extractedResponse = { ...push_stats_resp.data };
      return res.status(200).send(JSON.stringify({ ...extractedResponse }));
    } catch (e) {
      console.log("err:", e);
      return res.status(403).send("Can't push node stats!");
    }
  }
  catch(err)
  {
    next(err);
  }
  

});

app.post('/delete-node', async(req,res)=>{
  console.log("delete node")
  try{
    let nodeId = req.body.nodeId;
    let token = req.cookies.jwt;
    
    console.log("n:",nodeId, token);

    let reps_token_check = await axios.post(
      `http://${hostPOV}:3002/check-token`,
      { token }
    );
    let ownerId = reps_token_check.data.id;
  
    let nodeBdResp = null;
    try {
      let nodeBd = await axios.get(`http://${hostPOV}:3005/get-node/${nodeId}`);
      nodeBdResp = nodeBd.data;
    } catch (err) {
      return res.status(404).send("Can't identify node to delete!");
    }
  
    if (nodeBdResp !== null && nodeBdResp.owner == ownerId) {
      try{
          let deleteResponse = await axios.post(`http://${hostPOV}:3005/delete`, {nodeId});
          console.log("Delete response:",deleteResponse);
      }
      catch(err)
      {
        return res.status(404).send("Can't delete node from db!");
      }
      
      console.log("test:",nodeBdResp.data)
      let containerId = nodeBdResp.containerId;
      console.log("containerId:", containerId);

      exec(`docker rm ${containerId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Eroare la ștergerea containerului: ${error.message}`);
          return res.status(500).json({ error: 'A apărut o eroare la ștergerea containerului.' });
        }
        if (stderr) {
          console.error(`Eroare la ștergerea containerului: ${stderr}`);
          return res.status(500).json({ error: 'A apărut o eroare la ștergerea containerului.' });
        }
        // Returnăm un răspuns de succes dacă containerul a fost șters cu succes
        return res.json({ message: 'Containerul a fost șters cu succes.' });
      });


    } else {
      return res.status(403).send("You can't delete this node");
    }
  }
  catch(err)
  {
    return res.status(500).send('Something broke!')
  }
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(SERVER_ADDRESS, () => {
  console.log(`Node Business Service at port ${SERVER_ADDRESS}`);
});

// API GATEWAY LOGIC
const SubscribeAction = async () => {
  function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
  const resources = {
    "fetch-nodes_GET": {
      needsAuth: true,
      roles: [],
      route: "fetch-nodes",
    },
    "fetch-node_GET": {
      needsAuth: true,
      roles: [],
      route: "fetch-node",
    },
    "establish-node-connection_POST": {
      needsAuth: true,
      roles: [],
      route: "establish-node-connection",
    },
    "push-node-stats_POST": {
      needsAuth: true,
      roles: [],
      route: "push-node-stats",
    },
    "push-node-training_POST": {
      needsAuth: true,
      roles: [],
      route: "push-node-training",
    },
    "delete-node_POST":{
      needsAuth: true,
      roles: [],
      route: "delete-node",
    }
  };
  let status_subscribe = false;
  while (!status_subscribe) {
    await sleep(1000);
    try {
      await axios.post(`http://${hostPOV}:3001/subscribe`, {
        service_id,
        SERVER_ADDRESS,
        resources,
      });
      status_subscribe = true;
    } catch (e) {
      console.log("Failed to subscribe");
    }
  }
};

const HeartBeat = async () => {
  console.log("beat");
  try {
    await axios.post(`http://${hostPOV}:3001/heart-beat`, {
      service_id,
    });
  } catch (e) {
    console.log("Failed to HeartBeat");
  }
};

setInterval(() => {
  HeartBeat();
}, 5000);

SubscribeAction();
