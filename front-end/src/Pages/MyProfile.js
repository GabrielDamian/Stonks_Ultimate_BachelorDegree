import React,{useState, useEffect} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './Style/MyProfile.css';
import TopBar from '../Components/Organisms/TopBar';
import {collectUserData} from '../API/apiCore';
import ProfileIcon from '../Media/Icons/profile.png';
import Popover from '@mui/material/Popover';
import NodeIcon from '../Media/Icons/node.png';
import { useNavigate} from 'react-router-dom';

const NodeItem = ({data})=>{
    
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handlePopoverClose = () => {
    setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const handleRedirect = ()=>{
        navigate(`/node-page/?nodeid=${data.id}`)
    }
    return(
        <>
            <div 
                onClick={handleRedirect}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className='my-profile-content-card-nodes-items-el'
                style={{
                    border: `2px solid #${Math.floor(Math.random()*16777215).toString(16)}`
                }}
                
                >
                    <img src={NodeIcon}></img>
            </div>
            <Popover
                id="mouse-over-popover"
                sx={{
                pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <div className='my-profile-content-card-nodes-items-el-pop'>
                    <p>Buil name: {data.buildName}</p>
                    <p>Status: {data.status}</p>
                </div>
            </Popover>
        </>
        
    )
}
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


