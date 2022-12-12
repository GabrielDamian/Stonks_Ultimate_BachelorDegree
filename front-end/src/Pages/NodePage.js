import {React, useState, useEffect} from 'react';
import './Style/NodePage.css';
import TopBar from '../Components/Organisms/TopBar';
import LeftMenu from '../Components/Organisms/LeftMenu';

function NodePage({tabIndex,setTabs,tabs,userId})
{
    const [nodeData, setNodeData] = useState({})
    useEffect(()=>{
        console.log("nodeData update:",nodeData)
    },[nodeData])

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
        console.log("connectToNode fct:",nodeID)
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
                    console.log("connect to node resp:", data)
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
                   <p>NodePage</p>
                </div>
            </div>
        </div>
    )
}
export default NodePage;
