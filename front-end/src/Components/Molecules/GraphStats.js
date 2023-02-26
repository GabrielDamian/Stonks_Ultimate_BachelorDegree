import React,{useState, useEffect} from 'react';
import './GraphStats.css';


export default function GraphStats({realData}){

    useEffect(()=>{
        console.log("Graph Stats:",realData)
        extractAverages(realData)
    },[realData])

    const [innerState, setInnerState] = useState({
        avgLast: 'ceva',
        avgLife: 'altceva'
    });

    const extractAverages = (sourceParam)=>{
        if (sourceParam == null) return

        console.log("extractAverages:",sourceParam)
        if(realData.length > 7)
        {
            let dif7Days = 0;
            let lifeTime = 0;

            for(let i=6;i>0;i--)
            {
                dif7Days += Math.abs(realData[i].predictedValue - realData[i].realValue)
            }
            for(let i=realData.length-1;i>0;i--)
            {
                lifeTime += Math.abs(realData[i].predictedValue - realData[i].realValue)
            }
            let avg7Days = (dif7Days / 7).toFixed(2);
            let avgLifetime = (lifeTime/realData.length).toFixed(2);
            console.log("avg7Days:",avg7Days,avgLifetime)

            setInnerState({
                avgLast: avg7Days,
                avgLife: avgLifetime
            })
        }
        else 
        {
            let total = 0;

            for(let i=realData.length-1;i>0;i--)
            {
                total += Math.abs(realData[i].predictedValue - realData[i].realValue)
            }
            let avgTotal = (total / realData.length).toFixed(2);
            console.log("avgTotal:",avgTotal)
            setInnerState({
                avgLast: avgTotal,
                avgLife: avgTotal
            })
        }
    }

    return(
        <div className='graph-stats-container'>
            <div className='graph-stats-container-header'>
                <span>Real Data Comparasion</span>
            </div>
            <div className='graph-stats-container-content'>
                <p>Last week avg: {innerState.avgLast} units</p>
                <p>LifeTime avg: {innerState.avgLife} units</p>
            </div>
        </div>
    )
}