import React,{useState,useEffect} from 'react';
import './Dashboard.css';
import LeftMenu from '../Components/Organisms/LeftMenu';

export default function Dashboard({tabIndex,setTabs,tabs})
{
    return (
        <div className='dashboard-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <p>dashboard</p>
            </div>
        </div>
    )
}