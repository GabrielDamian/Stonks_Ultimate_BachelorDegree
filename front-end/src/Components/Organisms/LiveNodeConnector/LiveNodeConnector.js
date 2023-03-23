import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import './LiveConnector.css';

function LiveNodeConnector({nodeAddress}) {

  const [logs, setLogs] = useState([]);
  
  useEffect(()=>{
    
    if(nodeAddress !== null && nodeAddress != undefined)
    {
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
      <div className="node-live-connector-container-header">
        <span>Node Status:</span>
      </div>
      <div className="node-live-connector-container-content">
        <p>Container Address: {nodeAddress}</p>
        <p>Last heart beat: {logs.timestamp !== undefined ? logs.timestamp : 'loading'}</p>
        <p>Live Status: {logs.status !== undefined ? logs.status : 'loading'}</p>
      </div>
    </div>
  );
}

export default LiveNodeConnector;