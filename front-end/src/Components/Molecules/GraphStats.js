import React,{useState, useEffect} from 'react';
import './GraphStats.css';


export default function GraphStats({source}){

    useEffect(()=>{
        console.log("Graph Stats:",source)
    },[source])

    const [innerState, setInnerState] = useState({
        last30Days: 'ceva',
        lifeTime: 'altceva'
    });

    return(
        <div className='graph-stats-container'>
            <div className='graph-stats-container-header'>
                <span>Real Data Comparasion</span>
            </div>
            <div className='graph-stats-container-content'>
                <p>Last 30 days: {innerState.last30Days} </p>
                <p>Lifetime: {innerState.lifeTime}</p>
            </div>
        </div>
    )
}