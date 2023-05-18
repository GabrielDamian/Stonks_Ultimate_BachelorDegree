import React,{useState, useEffect} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './Style/MyProfile.css';
import TopBar from '../Components/Organisms/TopBar';
import {collectUserData} from '../API/apiCore';
import ProfileIcon from '../Media/Icons/profile.png';

import NodeItem from '../Components/Atoms/NodeItem';



export default function MyProfile({tabIndex,setTabs,tabs,userId}){
    
    const [userData, setUserData] = useState({})
    
    useEffect(()=>{
        if(userId !== null && userId !== undefined)
        {
            collectUserData(userId,['_id','username','email','role','nodes'],setUserData)
        }
    },[userId])
    
    return(
        <div className='my-profile-container'>
            <LeftMenu userId={userId} tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='my-profile-content'>
                <TopBar userId={userId}/>
                <div className='my-profile-content-data'>
                    <div className='my-profile-content-card'>
                        <div className='my-profile-content-card-top'>

                        </div>
                        <div className='my-profile-content-card-image'>
                            <img src={ProfileIcon}/>
                        </div>
                        <div className='my-profile-content-card-data'>
                            <p>ID: {userData._id}</p>
                            <p>{userData.username}</p>
                            <p>{userData.email}</p>
                            <p>{userData.role}</p>
                        </div>
                        <div className='my-profile-content-card-nodes'>
                            <div className='my-profile-content-card-nodes-header'>
                                <span>Nodes:</span>
                            </div>
                            <div className='my-profile-content-card-nodes-items'>
                                {userData.nodes ? userData.nodes.map((node)=>{
                                    return <NodeItem data={node}/>
                                }):null}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        
    )
}


