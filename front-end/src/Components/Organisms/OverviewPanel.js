import React, {useEffect, useState} from 'react';
import './OverviewPanel.css';

export default function OverviewPanel({data})
{
    useEffect(()=>{
        console.log("Overview panel data entry:",data)
    },[data])
    
    const [innerData, setInnerData] = useState([]);

    useEffect(()=>{
        if(data !== undefined)
        {
            
            setInnerData([
                ['Build Name', data['buildName']],
                ['Status', data['status']],
                ['Description', data['description']],
                ['Market', data['market']],
                ['Code', data['code']]
            ])

        }
    },[data])

    return (
        <div className='overview-panel-container'>
            <div className='overview-panel-container-header'>
                <span>Node Snapshot Data</span>
            </div>
            <div className='overview-panel-container-content'>
                {
                    innerData.map((el)=>{
                        return <OverviewSpanShoRow keyValue={el[0]} stringValue={el[1]}/> 
                    })
                }
            </div>
        </div>
    )
}

const OverviewSpanShoRow = ({keyValue, stringValue})=>{
    const formatCode = (codeValue)=>{
        let splitNewLine = codeValue.split('\n')
        console.log("splitNewLine:",splitNewLine)
        return(
            splitNewLine.map((el)=>{
                return <p>{el}</p>
            })
        )
    }
    return(
        <div className='overview-panel-container-content-row'>
            <div className='overview-panel-container-content-row-left'>
                <span>{keyValue}</span>
            </div>
            <div className='overview-panel-container-content-row-right'>
                <span>{keyValue == 'Code' ? formatCode(stringValue):stringValue}</span>
            </div>
        </div>
    )
}