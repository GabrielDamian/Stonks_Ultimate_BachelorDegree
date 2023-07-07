import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ChartComponent.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    customCanvasBackgroundColor: {
      color: 'lightGreen',
    }
  },
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Line Chart - Multi Axis',
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

function ChartComponentElem({source,realData}){

  const [innerState, setInnerState] = useState({
    real:{
      labels: [],
      values: []
    },
    predicted: {
      labels: [],
      values: []
    }
  })
    useEffect(()=>{
      if(realData !== undefined && realData !== null)
      {

        let realValues = []
        let realLabels = []
        let predictedValues = []
        let predictedLabels = []

        realData.forEach((el)=>{

          realValues.push(el.realValue)
          realLabels.push(new Date(el.realTime).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}))

          predictedValues.push(el.predictedValue)
          predictedLabels.push(new Date(el.predicredTime).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}))

        })
        setInnerState({
          real:{
            labels: [...realLabels],
            values: [...realValues]
          },
          predicted: {
            labels: [...predictedLabels],
            values: [...predictedValues]
          }
        })
      }
    },[realData])
  

  return <Line options={options} data={
    {
      labels:[...innerState.real.labels],
      datasets: [
        {
          label: 'Real', 
          data: [...innerState.real.values],
          borderColor: '#b0afb2',
          backgroundColor: '#bcfe2f',
          yAxisID: 'y1',
        },
        {
          label: 'Predicted', 
          data: [...innerState.predicted.values],
          borderColor: 'red',
          backgroundColor: '#bcfe2f',
          yAxisID: 'y1',
        },
      ],
    }
  } />;
}

export function ChartComponent({source,realData}){
  
  useEffect(()=>{
    let justOneValue = true;
    if(source.length > 0)
    {
      let firstVal = source[0].value
      source.forEach((el)=>{
        if(el.value !== firstVal)
        {
          justOneValue = false
        }
      })
    }
    if(justOneValue == true)
    {
      setInnerState([[],[]])
    }
    else 
    {
      setInnerState([source, realData])
    }
  },[source, realData])

  const [innerState, setInnerState] = useState([[],[]])

  return (
    <div className="custom-char-component-container">
        <ChartComponentElem source={innerState[0]} realData={innerState[1]}/>
    </div>
  )
}