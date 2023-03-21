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

    if(pairs !== undefined && pairs.length > 0)
    {
      let localLabels = []
      let localValues = []

      pairs.forEach((el)=>{
        localLabels.push(el["interval"])
        localValues.push(Number(el["value"]))
      })
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

  
  
  return (
      <Bar 
        options={options} 
        data={chartData} 
      />
  )
}
