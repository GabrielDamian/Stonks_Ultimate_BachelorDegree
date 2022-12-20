import React,{useState, useEffect} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './Style/MyProfile.css';
import TopBar from '../Components/Organisms/TopBar';
import {collectUserData} from '../API/apiCore';


export default function MyProfile({tabIndex,setTabs,tabs,userId}){
    
    const [userData, setUserData] = useState({})
    useEffect(()=>{
        console.log("userData update:",userData)
    },[userData])
    
    useEffect(()=>{
        if(userId !== null && userId !== undefined)
        {
            collectUserData(userId,['_id','username','email','role','nodes'],setUserData)
        }
    },[userId])
    
    return(
        <div className='my-profile-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='my-profile-content'>
                <TopBar userId={userId}/>
                <div className='my-profile-content-data'>
                    {/* <p> my profile page </p>
                    <p>{.email}</p> */}
                    <p>User id:---- {userData._id}</p>
                    <p>Username:--- {userData.username}</p>
                    <p>Email:--- {userData.email}</p>
                    <p>Role:--- {userData.role}</p>
                    <p>Nodes:--- {userData.nodes ? userData.nodes.map((node)=>{
                        return<b>-{node}-</b>
                    }):null}</p>
                </div>
            </div>
        </div>
        
    )
}