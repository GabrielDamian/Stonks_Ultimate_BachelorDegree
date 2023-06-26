import React, {useState, useEffect } from 'react';
import './NodeInfo.css';
import { useNavigate } from 'react-router-dom';


import Perf_1_icon from '../../Media/Icons/perf_1.png';
import Perf_2_icon from '../../Media/Icons/perf_2.png';
import Perf_3_icon from '../../Media/Icons/perf_3.png';

import TempDisplayNodeItem from '../Atoms/TempDisplayNodeItem';


export default function NodeInfo({nodeData})
{
    const navigate = useNavigate();
    
    const [localData, setLocalData] = useState({
        BuildName: 'x',
        Status: 'x',
        Description: 'x',
        Market: 'x',
        Code: 'x'
    })
    const [average, setAverage] = useState('_%');

    const [modelTests, setModelTests] = useState({
        'MAE':{
            icon: Perf_1_icon,
            value: 'none'
        },
        'MSE':{
            icon: Perf_2_icon,
            value: 'none'
        },
        'RMSE':{
            icon: Perf_3_icon,
            value: 'none'
        },
    })

    useEffect(()=>{
        if(nodeData !== undefined)
        {   
            // extract initial tests
                if(nodeData.initTest !== undefined)
                {
                    setModelTests({
                        'MAE':{
                            icon: Perf_1_icon,
                            value: parseFloat(nodeData.initTest.mae_test).toFixed(3)
                        },
                        'MSE':{
                            icon: Perf_2_icon,
                            value: parseFloat(nodeData.initTest.mse_test).toFixed(3)
                        },
                        'RMSE':{
                            icon: Perf_3_icon,
                            value: parseFloat(nodeData.initTest.rmse_test).toFixed(3)
                            }})
                }
            let localCopy = {
                BuildName: nodeData.buildName,
                Description: nodeData.description,
                Market: nodeData.market,
                Code: nodeData.code
            }
            if(nodeData.status !== undefined)
            {
                let statusConcat = nodeData.status.split(",")
                statusConcat.forEach((el)=>{
                    let pairKeyValue = el.split(":")
                    localCopy[pairKeyValue[0].trim()] = pairKeyValue[1]
                })

            }

            setLocalData(localCopy)
            setAverage(extractAverage(nodeData.initTests))
        }
    },[nodeData])
    
    let extractNodeData = (source)=>{
        let codeObjIndex = undefined;

        let temp = []
        Object.keys(source).forEach((el, index)=>{
            if(el == "Code")
            {
                codeObjIndex = index;
            }
            let obj = {
                key: el,
                content: source[el]
            }
            temp.push(obj)
        })


        function moveElement(array, fromIndex, toIndex) {
            const element = array.splice(fromIndex, 1)[0];
          
          
            array.splice(toIndex, 0, element);
          
            return array;
          }
        if(codeObjIndex !== undefined)
        {
            temp = moveElement(temp, codeObjIndex, temp.length)
        }

        return temp
    }   
    
    const extractAverage = (initTestsParam)=>{
        if(initTestsParam !== undefined)
        {
            let totalDif = 0;
            let count = 0;
            initTestsParam.forEach((el)=>{
                let split = el.interval.split(" ")
                let values = [Number(split[0]), Number(split[1])]

                let valueItem = undefined
                if(values[0] > 0)
                {
                    valueItem = values[0]
                }
                else 
                {
                    valueItem = values[1]
                }
                
                totalDif +=  Number(el.value) * valueItem;
                count += Number(el.value)
            })

            let average = totalDif/count;
            if (average !== NaN)
            {
                return average.toFixed(2)
            }
        }
       
        return '_'
    }


    const handleDeleteAction = async ()=>{
        const queryParams = new URLSearchParams(window.location.search)
        const nodeId = queryParams.get("nodeid")
        console.log("node id to delete:",nodeId)
        if (window.confirm("Are you sure you want to delete this node?") == true) {
            try{
                    fetch('http://localhost:3001/delete-node', { 
                        method: 'POST', 
                        body: JSON.stringify({
                            nodeId: nodeId,
                        }),
                        headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Access-Control-Allow-Credentials':true
                        },
                        withCredentials: true,
                        credentials: 'include'
                    })
                    .then(res => res.json())
                    .then(res => {
                        console.log("delete resp:", res)
                        alert("Delete ok!");
                        navigate('/overview')
                    })
                    .catch((err)=>{
                        alert("Nu se poate sterge node!")
                    })
              }
              catch(err)
              {
                console.error("Overview:", err)
              }

        } else {
            alert("Deletion canceled!")
        }
    }
    return(
        <div className="node-info-left">
            <div className='node-info-container'>
                <div className='node-info-container-header'>
                    <span>Details:</span>
                </div>
                <div className='node-info-container-content'>
                {
                    extractNodeData(localData).map((el)=>{
                        return <TempDisplayNodeItem keyItem={el.key} content={el.content}/>
                    })
                }
                </div>
            </div>
            <div className='node-info-container-stats-bar'>
                <div className='node-info-container-stats-bar-header'>
                    <span>Model Tests</span>
                </div>
                {
                    Object.keys(modelTests).map((el)=>{
                        return(
                            <div className='node-info-container-stats-bar-ratio'>
                                <div className='node-info-container-stats-bar-key'>
                                    <img src={modelTests[el].icon} alt="Test icon"/>
                                </div>
                                <div className='node-info-container-stats-bar-value'>
                                    <span> {el}</span>
                                </div>
                                <div className='node-info-container-stats-bar-data'>
                                    <span>{modelTests[el].value}</span>
                                </div>
                            </div>
                        )
                    })
                }
                {/* <div 
                    style={{
                        width: '100%',
                        height: '80%',
                        display:'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid red'
                    }}>
                    <div className='node-info-container-stats-bar-barchart'>
                        <BarChart pairs={nodeData !== undefined && nodeData.initTests !== undefined ? nodeData.initTests : []}/>
                    </div>
                </div> */}
            </div>
            <div className='node-info-delete-btn'>
                <button title="Delete Node" onClick={handleDeleteAction}>Delete</button>
            </div>
        </div>
        
    )
}


