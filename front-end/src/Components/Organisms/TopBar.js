import {React, useState, useEffect} from 'react';
import './TopBar.css';
import {collectUserData} from '../../API/apiCore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../Molecules/CustomButton';
import LogoutIcon from '../../Media/Icons/menu/log-out.png';

export default function TopBar({userId}){
    const navigate = useNavigate();


    const [userEmail, setUserEmail] = useState('');

    useEffect(()=>{
        if(userId !== null && userId !== undefined)
        {
            collectUserData(userId,['email'],setUserEmail)
        }
    },[userId])

    const logOut = ()=>{
        Cookies.remove('jwt')
        navigate(`/login`);

    }

    return(
        <div className="top-bar-content-header">
            <div className="top-bar-content-header-left">
                <span>top-bar</span>
            </div>
            <div className="top-bar-content-header-right">
                <div className="top-bar-content-header-right-left">
                    <span>{userEmail.email}</span>
                </div>
                <div className="top-bar-content-header-right-right">
                    <img onClick={logOut} src={LogoutIcon} title="Log Out"/>
                </div>  
            </div>
        </div>
    )
}