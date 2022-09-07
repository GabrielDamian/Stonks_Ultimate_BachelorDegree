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
                    <div className="dashboard-content-data-box">
                        <div className="dashboard-content-data-box-center">
                        <div className="data-box-center-header">
                                <span>Last 7d performance:</span>
                            </div>
                            <div className="data-box-center-content">
                            {
                                botsPerformanceTemp.map((el)=>{
                                    return(
                                        <div className='data-box-center-content-item'>
                                            <div className='data-box-center-content-item-perf-section'>
                                                <span>{el.name}</span>
                                            </div>
                                            <div className='data-box-center-content-item-perf-section'>
                                                <span>Rating: {el.rating}</span>
                                            </div>
                                            <div className='data-box-center-content-item-perf-section'>
                                                <span>Variantion: {el.variation}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-content-data-box">
                        <div className="dashboard-content-data-box-center">
                            <div className="data-box-center-header">
                                <span>Bots Status LIVE:</span>
                            </div>
                            <div className="data-box-center-content">
                                {
                                    botsStatusTemp.map((el)=>{
                                        return(
                                            <div className='data-box-center-content-item'>
                                                <div className='data-box-center-content-item-name'>
                                                    <span>{el.name}</span>
                                                </div>
                                                <div className='data-box-center-content-item-status'>
                                                    <span>Status: {el.status}</span>
                                                </div>
                                                <div className='data-box-center-content-item-actions'>
                                                    <div className='data-box-center-content-item-actions-item'>
                                                        <span>Start</span>
                                                    </div>
                                                    <div className='data-box-center-content-item-actions-item'>
                                                        <span>Stop</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                          
                        </div>
                    </div>
                    <div className="dashboard-content-data-box">
                        <div className="dashboard-content-data-box-center">
                        <div className="data-box-center-header">
                                <span>Best on the marketplace:</span>
                            </div>
                            <div className="data-box-center-content">
                            {
                                botsPerformanceTemp.map((el)=>{
                                    return(
                                        <div className='data-box-center-content-item'>
                                            <div className='data-box-center-content-item-perf-section'>
                                                <span>{el.name}</span>
                                            </div>
                                            <div className='data-box-center-content-item-perf-section'>
                                                <span>Rating: {el.rating}</span>
                                            </div>
                                            <div className='data-box-center-content-item-perf-section'>
                                                <span>Variantion: {el.variation}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-content-data-box">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}