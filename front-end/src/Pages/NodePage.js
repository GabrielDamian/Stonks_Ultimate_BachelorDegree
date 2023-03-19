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
                console.log("err  private route:",response.status)
            }
            else 
            {
                const data = await response.json();
                console.log("node data:",data)
                setStateCallback(data)
            }
      }
      catch(err)
      {
          console.log("err:",err)
      }
}
export let attachRealData = async (nodeDataParam, setStateParam)=>{
    console.log("nodeDataParam:",nodeDataParam)
    let market = nodeDataParam.market;
    console.log("market:",market)
    let predictions = nodeDataParam.predictions

    let translator={
        AAPL: 'apple-tokenized-stock-defichain',
        GOOG: 'google-tokenized-stock-defichain',
        'ETH-USD': 'binance-eth',
        'BTC-USD': 'binance-bitcoin'
        // FB: 'facebook-tokenized-stock-defichain',
    }
    let realValuesLink = `https://api.coingecko.com/api/v3/coins/${translator[market]}/market_chart?vs_currency=usd&days=300&interval=1d`
    console.log("realValuesLink",realValuesLink)
    let realValues = undefined;
    try{
        realValues = await axios.get(realValuesLink)
    }
    catch(e)
    {
        return 
    }
    console.log("realValues:", realValues)
    console.log("real data:",realValues.data.prices)

    let flatRealValues = realValues.data.prices
    let flatPredictedValues = predictions.map((el)=>{
        let timeStamp = Number(el.timestamp)
        let value = el.value
        return [timeStamp, value]
    })

    console.log("prediflatRealValuesctions:",flatRealValues)
    console.log("flatPredictedValues:",flatPredictedValues)

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

        console.log("min Dif:", minDif,seconds,minutes, hours)


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
    setStateParam(finalPairs)
}
function NodePage({tabIndex,setTabs,tabs,userId})
{
    const [nodeData, setNodeData] = useState({})
    const [realData, setRealData] = useState(null);
    const [nodeAddress, setNodeAddress] = useState(null);
    
    useEffect(()=>{
        console.log("node data:", nodeData)
        console.log("noed address:", nodeAddress)
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
            fetchNodeData(nodeId, setNodeData)
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
                   <div className='node-page-content-data-stats'>
                        <ChartComponent source={nodeData.predictions} realData={realData}/>
                        <GraphStats realData={realData} />
                        <LastPriceWidget value={nodeData.predictions}/>
                        <LiveNodeConnector nodeAddress={nodeAddress}/>
                   </div>
                </div>
            </div>
        </div>
    )
}
export default NodePage;
