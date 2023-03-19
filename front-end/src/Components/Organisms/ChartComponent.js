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
import faker from 'faker';
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
    console.log("innerStat update:",innerState)
  },[innerState])
  
    useEffect(()=>{
      if(realData !== undefined && realData !== null)
      {
        console.log("char component realData:", realData)

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
  
  let howManyBehind = 20;

  // useEffect(()=>{
    
  //   if(source !== undefined)
  //   {
  //     prepareForInnerState(source)
  //   }

  // },[source])
  
  // let prepareForInnerState = (source)=>{

  //   let sliced = source.slice(0,howManyBehind)
  //   let labels = []
  //   let values = []

  //   sliced.forEach((el)=>{
  //     let timestamp = Number(el.timestamp);
  //     let formattedDate = new Date(timestamp).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
  //     labels.push(formattedDate)

  //     values.push(el.value)
  //   })

   
  // }

  
  
  return <Line options={options} data={
    {
      // labels,
      labels:[...innerState.real.labels],
      datasets: [
        {
          label: 'Real', 
          // data: valuesGrahp,
          data: [...innerState.real.values],
          borderColor: '#b0afb2',
          backgroundColor: '#bcfe2f',
          yAxisID: 'y1',
        },
        {
          label: 'Predicted', 
          // data: valuesGrahp,
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
    console.log("weird 1:", source,)
    console.log("weird 2:",realData);
  },[source, realData])

  return (
    <div className="custom-char-component-container">
        <ChartComponentElem source={source} realData={realData}/>
    </div>
  )
}