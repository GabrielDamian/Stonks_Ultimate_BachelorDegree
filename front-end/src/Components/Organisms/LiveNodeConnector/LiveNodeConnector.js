import HttpCall from "./HttpCall";
import WebSocketCall from "./WebSocketCall";
// import { io } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import './LiveConnector.css';

function LiveNodeConnector({nodeAddress}) {

  const [lastSocketLog, setLastSocketLog] = useState('default init log')  

  const [logs, setLogs] = useState([]);
  
  useEffect(()=>{
    console.log("logs update:",logs)
  },[logs])

  const formatLogs =(rawLogsSource)=>{

    let result = rawLogsSource.map((logItem)=>{
      let separator = "__//__"

      let extractItems = logItem.split(separator)

      let finalLogItem = {
        'timestamp': extractItems[0].slice(0,-7),
        'content': extractItems[1]
      }
      return finalLogItem
    })

    return result
  }
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

      // const socket = io(`http://localhost:5000/`, {
      //   transports: ["websocket"],
      //   cors: {
      //     origin: "http://localhost:3000/",
      //   },
      // });


      socket.on("connect", (data) => {
        // console.log("<<-->>> socket response:", data)
        let newLogsFormated = formatLogs(data)

        setLogs((prev)=>{
          let contactStates = [...prev, ...newLogsFormated]
          return contactStates
        })

        setLastSocketLog((prev)=>{
          return prev +"\n\n"+data
        })
      });

      // socket.on("data", (data) => {
      //   console.log("data received:", data)
      // });

      return function cleanup() {
        socket.disconnect();
      };

    }
  },[nodeAddress])

  return (
    <div className="node-live-connector-container">
      {/* <h1>React/Flask App + socket.io</h1>
      <div className="line">
        <HttpCall />
      </div> */}
      <div className="node-live-connector-container-items">
        <p>Container Address: {nodeAddress}</p>
        <p>Logs:</p>
        {/* <p>Last Log:{lastSocketLog}</p> */}
        {
          logs.map((el)=>{
            return <LogItem timestamp={el.timestamp} content={el.content}/>

          })
        }
      </div>
    </div>
  );
}

const LogItem = ({timestamp, content})=>{
    return(
      <div className="log-item-container">
          <span><b>{timestamp}:</b> &nbsp;&nbsp; {content}</span>
      </div>
    )

}
export default LiveNodeConnector;