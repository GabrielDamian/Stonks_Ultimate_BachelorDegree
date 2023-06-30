import {React, useState, useEffect} from 'react';
import './Style/NodePage.css';
import TopBar from '../Components/Organisms/TopBar';
import LeftMenu from '../Components/Organisms/LeftMenu';
import LiveNodeConnector from '../Components/Organisms/LiveNodeConnector/LiveNodeConnector';
import NodeInfo from '../Components/Organisms/NodeInfo';
import { ChartComponent } from '../Components/Organisms/ChartComponent';
import LastPriceWidget from '../Components/Organisms/LastPriceWidget';
import GraphStats from '../Components/Organisms/GraphStats';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const fetchNodeData = async (nodeID, setStateCallback)=>{
    try{
        let destination = `http://localhost:3001/fetch-node/?nodeid=${nodeID}`
        let response = await fetch(destination, { 
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
                console.error("NodePage Response:", response)
            }
            else 
            {
                const data = await response.json();
                setStateCallback(data)
            }
      }
      catch(err)
      {
        console.error("Node Page:", err)
      }
}
export let attachRealData = async (nodeDataParam, setStateParam)=>{

    console.log("attachRealData:",nodeDataParam.predictions)
    let market = nodeDataParam.market;
    let predictions = nodeDataParam.predictions

    let translator={
        AAPL: 'apple-tokenized-stock-defichain',
        GOOG: 'google-tokenized-stock-defichain',
        'ETH-USD': 'binance-eth',
        'BTC-USD': 'binance-bitcoin'
    }
    console.log("translator:",translator[market])
    let realValuesLink = `https://api.coingecko.com/api/v3/coins/${translator[market]}/market_chart?vs_currency=usd&days=300&interval=1d`
    let realValues = undefined;
    try{
        realValues = await axios.get(realValuesLink)
    }
    catch(e)
    {
        return 
    }
    console.log("realValues:",realValues)

    let flatRealValues = realValues.data.prices
    let flatPredictedValues = predictions.map((el)=>{
        let timeStamp = Number(el.timestamp)
        let value = el.value
        return [timeStamp, value]
    })

    let finalPairs = []
    flatPredictedValues.forEach((el)=>{
        let unitsDay = 86400000

        let minDif = Math.abs(el[0] - flatRealValues[0][0])

        let minItem = flatRealValues[0]

        flatRealValues.forEach((real_el)=>{
            if(Math.abs(real_el[0] - el[0]) < minDif)
            {
                minDif = Math.abs(real_el[0] - el[0])
                minItem = real_el
            }
        })

        let seconds = Math.floor(minDif / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        if(minDif < unitsDay)
        {
            let tempConcat = {
                realValue: minItem[1],
                realTime: minItem[0],
                predictedValue: el[1],
                predicredTime:  el[0]
            }
            finalPairs.push(tempConcat)
        }
    })

    console.log("finalPairs:",finalPairs)
    // finalPairs[finalPairs.length-1]['realValue'] = undefined


    console.log("finalPairs:",finalPairs)
    setStateParam(finalPairs)
}

function NodePage({tabIndex,setTabs,tabs,userId})
{
    const navigate = useNavigate();
    const [nodeData, setNodeData] = useState({});
    
    
    const [realData, setRealData] = useState(null);
    const [nodeAddress, setNodeAddress] = useState(null);
    
    useEffect(()=>{
        if(nodeData.market !== undefined)
        {
            attachRealData(nodeData,setRealData);
        }
    },[nodeAddress, nodeData])
    
    
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
                    console.error("NodePage:",response)
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
            console.error("NodePage:",err)
          }
    }

    useEffect(()=>{
        // extract from query params
        const queryParams = new URLSearchParams(window.location.search)
        const nodeId = queryParams.get("nodeid")
        if(nodeId == undefined || nodeId == "" || nodeId == " ")
        {
            navigate('/overview')
        }
        else 
        {
            fetchNodeData(nodeId, setNodeData)
            connectToNode(nodeId)
        }
    },[])

    const DecideWidgets = (nodeDataParam)=>{
        if(nodeDataParam == undefined || nodeDataParam.status == undefined) return [false, '']
        let status = nodeDataParam.status.split(',')[0].split(':')

        if(status[1].trim() == 'InProgress')
        {
            return [false, 'Docker deploying']
        }
        else if(status[1].trim() == 'Success') 
        {
            if(nodeDataParam.predictions.length == 0)
            {
                return [false, 'Node is training']
            }
            else 
            {
                return [true, '']
            }
        }
        else if(status[1].trim() == 'Failure')
        {
            return [false, 'Docker failed']
        }
        else if(status[1].trim() == 'Crash')
        {
            return [false, 'Node app crashed']
        }
        else 
        {
            return [false, 'final']
        }
    }

    return(
        <div className='node-page-container'>
            <LeftMenu userId={userId} tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='node-page-content'>
                <TopBar userId={userId}/>
                <div className='node-page-content-data'>
                    <NodeInfo 
                        nodeData={nodeData} 
                        showStats={DecideWidgets(nodeData)[0]}
                        />
                    {
                        DecideWidgets(nodeData)[0] == false ? 
                        <div style={{
                            width:'40%',
                            padingTop: '20px',
                        }}>
                            <h2
                                style={{
                                    border: '1px solid #525252',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    width: 'auto',
                                    textAlign: 'center'
                                }}
                            >Status: {DecideWidgets(nodeData)[1]}</h2>
                        </div>
                        :
                        <div className='node-page-content-data-stats'>
                            <ChartComponent source={nodeData.predictions} realData={realData}/>
                            <GraphStats realData={realData} />
                            <LastPriceWidget value={nodeData.predictions}/>
                            <LiveNodeConnector nodeAddress={nodeAddress}/>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default NodePage;
