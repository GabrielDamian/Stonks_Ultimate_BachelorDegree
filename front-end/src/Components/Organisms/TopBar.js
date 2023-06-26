import React,{ useState, useEffect} from 'react';
import './TopBar.css';
import {collectUserData} from '../../API/apiCore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../Atoms/CustomButton';
import LogoutIcon from '../../Media/Icons/menu/log-out.png';
import Popover from '@mui/material/Popover';

export default function TopBar({userId}){
    const navigate = useNavigate();

    const [userData, setUserData] = useState('');
    
    useEffect(()=>{
        if(userId !== null && userId !== undefined)
        {   

            collectUserData(userId,['email','role','username','noNodes'],setUserData)
        }
    },[userId])

    const logOut = ()=>{
        Cookies.remove('jwt')
        navigate(`/login`);
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return(
        <div className="top-bar-content-header">
            <div className="top-bar-content-header-left">
                {/* <span>top-bar</span> */}
            </div>
            <div className="top-bar-content-header-right">
                <div className="top-bar-content-header-right-left">
                    <span
                        onClick={()=>{
                            navigate(`/my-profile`);
                        }}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}    
                        >{userData.email}</span>
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
                           <div className='top-bar-content-header-popover'>
                                <p><b>Username: </b>{userData.username}</p>
                                <p><b>Email: </b>{userData.email}</p>
                                <p><b>NoNodes: </b>{userData.noNodes}</p>
                                <p><b>Role: </b>{userData.role}</p>
                           </div>
                        </Popover>
                </div>
                <div className="top-bar-content-header-right-right">
                    <img title="logout" onClick={logOut} src={LogoutIcon} title="Log Out"/>
                </div>  
            </div>
        </div>
    )
}