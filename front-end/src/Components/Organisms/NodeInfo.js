import React, {useState, useEffect } from 'react';
import './NodeInfo.css';

export default function NodeInfo({nodeData})
{
    
    const [localData, setLocalData] = useState({
        BuildName: 'x',
        Status: 'x',
        Description: 'x',
        Market: 'x',
        Code: 'x'
    })
    useEffect(()=>{
        if(nodeData !== undefined)
        {
            setLocalData(({
                BuildName: nodeData.buildName,
                Status: nodeData.status,
                Description: nodeData.description,
                Market: nodeData.market,
                Code: nodeData.code
            }))
        }
    },[nodeData])
    
    let extractNodeData = (source)=>{
        console.log("SOURCE:",source)
        let temp = []
        Object.keys(source).forEach((el)=>{
            console.log("new extract:", el)
            let obj = {
                key: el,
                content: source[el]
            }
            temp.push(obj)
        })

        return temp
    }   

    return(
        <div className='node-info-container'>
            {
                extractNodeData(localData).map((el)=>{
                    console.log("iterator:", el)
                    return <TempDisplayNodeItem keyItem={el.key} content={el.content}/>
                })
            }
        </div>
    )
}

const TempDisplayNodeItem = ({keyItem,content})=>{
    useEffect(()=>{
        console.log("key deeeep:", keyItem,content)
    },[keyItem])
    return (
        keyItem == 'Code'?
        <div className='node-info-temp-item'>
            <div className='node-info-temp-item-key'>
               <span>{keyItem}</span>
            </div>
            <div className='node-info-temp-item-content'>
                <pre>
                    <code>
                      {content}
                    </code>
                </pre>
            </div>
        </div>
        :
        <div className='node-info-temp-item'>
            <div className='node-info-temp-item-key'>
               <span>{keyItem}</span>
            </div>
            <div className='node-info-temp-item-content'>
                <span>{content}</span>
            </div>
        </div>
        
    )
}
