import React,{useState,useEffect} from 'react';
import './Style/Dashboard.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import TopBar from '../Components/Organisms/TopBar';

const botsStatusTemp = [
    {
        name: 'bot 1 test',
        status: 'active',
    },
    {
        name: 'bot 2 test',
        status: 'active'
    },
    {
        name: 'bot 3 test',
        status: 'stopped'
    },
    {
        name: 'bot 4 test',
        status: 'stopped'
    }
]

const botsPerformanceTemp = [
    {
        name: 'bot 1 test',
        rating: '5/7',
        variation: '5%'
    },
    {
        name: 'bot 2 test',
        rating: '2/7',
        variation: '1%'
    },
    {
        name: 'bot 3 test',
        rating: '6/7',
        variation: '-3%'
    },
    {
        name: 'bot 4 test',
        rating: '0/7',
        variation: '-65%'
    }
]


export default function Dashboard({tabIndex,setTabs,tabs,testProp,userId})
{
    useEffect(()=>{
        console.log("Dash props:",testProp)
    },[])
    
    return (
        <div className='dashboard-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className="dashboard-content-data">
                  
                </div>
            </div>
        </div>
    )
}