import React, {useEffect, useState} from 'react';
import './OverviewPanel.css';

export default function OverviewPanel({data})
{
    useEffect(()=>{
        console.log("Overview panel data entry:",data)
    },[data])
    
    return (
        <p style={{color: 'white'}}>OverviewPanel</p>
    )
}