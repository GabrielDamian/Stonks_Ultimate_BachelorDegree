import React,{useState,useEffect} from 'react';
import './Dashboard.css';
import LeftMenu from '../Components/Organisms/LeftMenu';

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


export default function Dashboard({tabIndex,setTabs,tabs})
{
    return (
        <div className='dashboard-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <div className="dashboard-content-header">
                    <div className="dashboard-content-header-left">
                        <span>Dashboard</span>
                    </div>
                    <div className="dashboard-content-header-right">
                        <div className="dashboard-content-header-right-left">
                            <div className="dashboard-content-header-right-left-top">
                                <span>Username</span>
                            </div>
                            <div className="dashboard-content-header-right-left-bot">
                                <span>Balance: 0.00$</span>
                            </div>
                        </div>
                        <div className="dashboard-content-header-right-right">
                            <span>Logout</span>
                        </div>  
                    </div>
                </div>
                <div className="dashboard-content-data">
                  
                </div>
            </div>
        </div>
    )
}