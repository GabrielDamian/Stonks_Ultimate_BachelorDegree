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
});

app.get("/fetch-node", async (req, res) => {
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
});

app.post("/establish-node-connection", async (req, res) => {
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
});

app.post("/push-node-stats", async (req, res) => {
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
});

app.post("/push-node-training", async (req, res) => {
  let { node_id, intervals, values } = req.body;

  let pairs = [];
  intervals.forEach((el, index) => {
    pairs.push({
      interval: el,
      value: values[index],
    });
  });

  try {
    let push_stats_resp = await axios.post(
      `http://${hostPOV}:3005/push_tests`,
      {
        data: pairs,
        node_id: node_id,
      }
    );

    let extractedResponse = { ...push_stats_resp.data };
    return res.status(200).send(JSON.stringify({ ...extractedResponse }));
  } catch (e) {
    console.log("err:", e);
    return res.status(403).send("Can't push node stats!");
  }
});

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
