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

function ChartComponentElem({source}) {

    useEffect(()=>{
      console.log("char component source:", source)
    },[source])
  
  let howManyBehind = 20;

  useEffect(()=>{
    
    if(source !== undefined)
    {
      prepareForInnerState(source)
    }

  },[source])
  
  let prepareForInnerState = (source)=>{

    let sliced = source.slice(0,howManyBehind)
    let labels = []
    let values = []

    sliced.forEach((el)=>{
      let timestamp = Number(el.timestamp);
      let formattedDate = new Date(timestamp).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
      labels.push(formattedDate)

      values.push(el.value)
    })

    setLabels(labels)
    setValuesGraph(values)
  }

  const [valuesGrahp, setValuesGraph] = useState()
  const [labels, setLabels] = useState([]
    )
  return <Line options={options} data={
    {
      labels,
      datasets: [
        {
          label: 'Dataset 2', 
          data: valuesGrahp,
          borderColor: '#b0afb2',
          backgroundColor: '#bcfe2f',
          yAxisID: 'y1',
        },
      ],
    }
  } />;
}

export function ChartComponent({source}){

  
  return (
    <div 
      className="custom-char-component-container"
      style={{
        height: '100%',
        width: '100%',
      }}
      >
        <ChartComponentElem source={source} />
    </div>
  )
}