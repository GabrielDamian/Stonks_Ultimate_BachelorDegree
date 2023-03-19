import React,{useState, useEffect} from 'react';
import './LastPriceWidget.css';

export default function LastPriceWidget ({value}){
    
    const [lastValue, setLastValue] = useState({
        value: 'loading',
        timestamp: 'loading'
    });

    useEffect(()=>{
        if(value !== null && value !== undefined && value.length !== 0)
        {
            extractLastPrice(value[value.length -1])
        }
    },[value])

    const extractLastPrice = (source)=>{
        let timeStamp = new Date(Number(source.timestamp)).toLocaleDateString("en-US")
        let value = source.value;

        setLastValue({
            value: value,
            timestamp: timeStamp
        })
    }
    return(
        <div className="last-price-widget-container">
            <div className="last-price-widget-container-header">
                <span>Tomorrow:</span>
            </div>
            <div className="last-price-widget-container-content">
                <p>Date: {lastValue.timestamp}</p>
                <p>Value: {lastValue.value}</p>
            </div>
        </div>
    )
}