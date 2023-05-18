import React, {useEffect, useState} from 'react';
import OverviewSpanShoRow from '../Atoms/OverviewSpanShoRow';
import './OverviewPanel.css';

export default function OverviewPanel({data})
{
    const [innerData, setInnerData] = useState([]);

    useEffect(()=>{
        if(data !== undefined)
        {
            
            setInnerData([
                ['Build Name', data['buildName']],
                ['Status', data['status']],
                ['Description', data['description']],
                ['Market', data['market']],
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

