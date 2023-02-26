//@ts-nocheck
import React,{useState, useEffect} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['x', 'y', 'z', 't', 'g', 'h', 'h'];

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: '#bcfe2f',
//     },
//   ],
// };

export const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 2',
        data: [],
        backgroundColor: '#bcfe2f',
      },
    ],
  };
export function BarChart({pairs}) {
  const [chartData, setChartData] = useState(
    {
      labels,
      datasets: [
        {
          label: 'Dataset 2',
          data: [],
          backgroundColor: '#bcfe2f',
        },
      ],
    }
  )
  useEffect(()=>{
    console.log("paiurs:", pairs);
    console.log("faker:",faker.datatype.number({ min: 0, max: 1000 }))

    if(pairs !== undefined && pairs.length > 0)
    {
      console.log("use efect check ok")
      let localLabels = []
      let localValues = []

      pairs.forEach((el)=>{
        console.log("el:",el)
        localLabels.push(el["interval"])
        localValues.push(Number(el["value"]))
      })
      console.log("TEST:",localLabels, localValues);
      let ceva = {
        labels: localLabels,
        datasets: [
          {
            label: 'Dataset 2',
            data: [...localValues],
            backgroundColor: '#bcfe2f',
          },
        ],
      }
      console.log("before set state:", ceva)

      setChartData({
        labels: localLabels,
        datasets: [
          {
            label: 'Dataset 2',
            data: [...localValues],
            backgroundColor: '#bcfe2f',
          },
        ],
      })
    }
  },[pairs])

  
  useEffect(()=>{
    console.log("chartData update:",chartData)
  },[chartData])
  return (
      <Bar 
        options={options} 
        data={chartData} 
      />
  )
}
