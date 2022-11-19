import React,{useState, useEffect} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './Style/MyProfile.css';
import TopBar from '../Components/Organisms/TopBar';
import {collectUserData} from '../API/apiCore';


export default function MyProfile({tabIndex,setTabs,tabs,userId,testProp}){
    
    const [userData, setUserData] = useState({})

    
    useEffect(()=>{
        if(userId !== null && userId !== undefined)
        {
            console.log("collect user data effect")
            collectUserData(userId,['email'],setUserData)
        }
    },[userId])
    
    return(
        <div className='my-profile-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='my-profile-content'>
                <TopBar userId={userId}/>
                <div className='my-profile-content-data'>
                    <p> my profile page </p>
                    <p>{userData.email}</p>
                </div>
            </div>
        </div>
        
    )
}