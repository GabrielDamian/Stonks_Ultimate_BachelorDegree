import {React, useState, useEffect} from 'react';
import './Style/NodePage.css';
import TopBar from '../Components/Organisms/TopBar';
import LeftMenu from '../Components/Organisms/LeftMenu';
import LiveNodeConnector from '../Components/Organisms/LiveNodeConnector/LiveNodeConnector';
import NodeInfo from '../Components/Organisms/NodeInfo';
import { ChartComponent } from '../Components/Organisms/ChartComponent';
import LastPriceWidget from '../Components/Molecules/LastPriceWidget';



// TODO: delete faker real data generator
let generateFakeRealData = (source)=>{
    console.log("SOURCEEE:",source)
    let inner = []
    if(source == undefined || source == null) return undefined
    source.forEach((el)=>{
        let temp = {
            timestamp: el.timestamp,
            value: el.value + Math.floor(Math.random() * 10)
        }
        inner.push(temp)
    })
    console.log("inner:", inner)
    return inner
}
function NodePage({tabIndex,setTabs,tabs,userId})
{
    const [nodeData, setNodeData] = useState({})
    const [nodeAddress, setNodeAddress] = useState(null);
    
    useEffect(()=>{
        console.log("node data:", nodeData)
        console.log("noed address:", nodeAddress)

    },[nodeAddress, nodeData])
    
    let fetchNodeData = async (nodeID)=>{
        try{
            let destination = `http://localhost:3001/fetch-node/?nodeid=${nodeID}`

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
        try{
            let destination = `http://localhost:3001/establish-node-connection`
            
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
                    if(data.address != undefined && data.address != '' && data.address != ' ')
                    {
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
                   <div style={{
                    width: "40%",
                    border: '1px solid red'
                   }}>
                        
                        <ChartComponent source={nodeData.predictions}/>
                        <LastPriceWidget value={nodeData.predictions}/>
                        <LiveNodeConnector nodeAddress={nodeAddress}/>
                   </div>
                </div>
            </div>
        </div>
    )
}
export default NodePage;
