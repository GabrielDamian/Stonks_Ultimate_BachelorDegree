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

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// export const data = {
//   labels,
//   datasets: [
//     // {
//     //   label: 'Dataset 1',
//     //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//     //   borderColor: 'rgb(255, 99, 132)',
//     //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     //   yAxisID: 'y',
//     // },
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       borderColor: 'rgb(53, 162, 235)',
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//       yAxisID: 'y1',
//     },
//   ],
// };

export function ChartComponent({source}) {
  
  let howManyBehind = 20;

  useEffect(()=>{
    
    console.log("source deep:", source)
    if(source !== undefined)
    {
      prepareForInnerState(source)
    }

  },[source])
  
  let prepareForInnerState = (source)=>{

    console.log("prepareForInnerState:",prepareForInnerState)
    
    let sliced = source.slice(0,howManyBehind)
    console.log("sliced:", sliced)
    let labels = []
    let values = []

    sliced.forEach((el)=>{
      let timestamp = Number(el.timestamp);
      let formattedDate = new Date(timestamp).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
      labels.push(formattedDate)

      values.push(el.value)
    })

    console.log("labels:", labels)
    console.log("values:", values)
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
        // {
        //   label: 'Dataset 1',
        //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        //   borderColor: 'rgb(255, 99, 132)',
        //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
        //   yAxisID: 'y',
        // },
        {
          label: 'Dataset 2',
          data: valuesGrahp,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y1',
        },
      ],
    }
  } />;
}