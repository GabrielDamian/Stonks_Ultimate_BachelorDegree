import {React, useState, useEffect} from 'react';
import './Style/NodePage.css';
import TopBar from '../Components/Organisms/TopBar';
import LeftMenu from '../Components/Organisms/LeftMenu';
import LiveNodeConnector from '../Components/Organisms/LiveNodeConnector/LiveNodeConnector';
import NodeInfo from '../Components/Organisms/NodeInfo';

function NodePage({tabIndex,setTabs,tabs,userId})
{
    const [nodeData, setNodeData] = useState({})
    const [nodeAddress, setNodeAddress] = useState(null);
    
    useEffect(()=>{
        console.log("STEP 4:",nodeAddress)
    },[nodeAddress])
    
    let fetchNodeData = async (nodeID)=>{
        try{
            let destination = `http://localhost:3001/fetch-node/?nodeid=${nodeID}`
            console.log("destination:",destination)

            let response =await fetch(destination, { 
                    method: 'GET', 
                    headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Credentials':true
                    },
                    withCredentials: true,
                    credentials: 'include'
                })
                if(!response.ok)
                {
                    console.log("err  private route:",response.status)
                }
                else 
                {
                    const data = await response.json();
                    setNodeData(data)
                }
          }
          catch(err)
          {
              console.log("err:",err)
          }
    }
    
    let connectToNode = async (nodeID)=>{
        console.log("STEP 1",nodeID)
        try{
            let destination = `http://localhost:3001/establish-node-connection`
            console.log("destination:",destination)
            
            let response =await fetch(destination, { 
                    method: 'POST', 
                    body: JSON.stringify({nodeID}),
                    headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Credentials':true
                    },
                    withCredentials: true,
                    credentials: 'include'
                })
                if(!response.ok)
                {
                    console.log("err  private route:",response.status)
                }
                else 
                {
                    const data = await response.json();
                    console.log("STEP 2")
                    console.log("connect to node resp:", data)
                    if(data.address != undefined && data.address != '' && data.address != ' ')
                    {
                        console.log("STEP 3:",data.address)
                        setNodeAddress(data.address)
                    }
                }
          }
          catch(err)
          {
              console.log("err:",err)
          }
    }

    useEffect(()=>{
        // extract from query params
        const queryParams = new URLSearchParams(window.location.search)
        const nodeId = queryParams.get("nodeid")
        console.log("node id :",nodeId)
        if(nodeId == undefined || nodeId == "" || nodeId == " ")
        {
            console.log("invalid query param for nodeid")
        }
        else 
        {
            fetchNodeData(nodeId)
            connectToNode(nodeId)
        }
    },[])

    return(
        <div className='node-page-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='node-page-content'>
                <TopBar userId={userId}/>
                <div className='node-page-content-data'>
                   <NodeInfo nodeData={nodeData}/>
                   <LiveNodeConnector nodeAddress={nodeAddress}/>
                </div>
            </div>
        </div>
    )
}
export default NodePage;
