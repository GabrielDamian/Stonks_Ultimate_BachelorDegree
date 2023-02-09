import HttpCall from "./HttpCall";
import WebSocketCall from "./WebSocketCall";
// import { io } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import './LiveConnector.css';

function LiveNodeConnector({nodeAddress}) {

  const [logs, setLogs] = useState([]);
  
  useEffect(()=>{
    
    if(nodeAddress !== null && nodeAddress != undefined)
    {
      console.log("nodeAddress ok --> connect to node:",nodeAddress)

      const socket = io(`http://${nodeAddress}:5000`, {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
      });

      socket.on("connect", (data) => {
        if(data !== undefined){
          let separator = "__//__"
  
          let split = data[0].split(separator)
         
          setLogs({
            'timestamp': split[0],
            'status': split[1]
          })
        }
        
      });

      return function cleanup() {
        socket.disconnect();
      };

    }
  },[nodeAddress])

  return (
    <div className="node-live-connector-container">
      <div className="node-live-connector-container-items">
        <p>Container Address: {nodeAddress}</p>
        <p>Node Status:</p>
        <p>Timestamp:{logs.timestamp !== undefined ? logs.timestamp : 'loading'}</p>
        <p>Status: {logs.status !== undefined ? logs.status : 'loading'}</p>
      </div>
    </div>
  );
}

export default LiveNodeConnector;