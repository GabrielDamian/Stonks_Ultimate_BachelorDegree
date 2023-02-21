import React, {useState, useEffect } from 'react';
import CustomMonaco from './CustomMonaco';
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
        let temp = []
        Object.keys(source).forEach((el)=>{
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
    )
}

const TempDisplayNodeItem = ({keyItem,content})=>{
    return (
            keyItem === 'Code'? <CodeEditorNodeDisplay codeSource={content}/>:
            <div className='node-info-temp-item'>
                <div className='node-info-temp-item-key'>
                <span>{keyItem}:</span>
                </div>
                <div className='node-info-temp-item-content'>
                    <span>{content}</span>
                </div>
            </div>
    )
}
const CodeEditorNodeDisplay = ({codeSource})=>{
    return(
        <div className='node-info-temp-item-code'>
            <CustomMonaco  editorValue={codeSource} setEditorValue={()=>{}} options={{readOnly: true}}/>
        </div>
    )
}