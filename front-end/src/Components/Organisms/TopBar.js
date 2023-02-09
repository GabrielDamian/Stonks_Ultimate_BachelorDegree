import {React, useState, useEffect} from 'react';
import './TopBar.css';
import {collectUserData} from '../../API/apiCore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

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
                    <div className="top-bar-content-header-right-left-top">
                        <span>Username:{userEmail.email}</span>
                    </div>
                    <div className="top-bar-content-header-right-left-bot">
                        {/* <span>Balance: 0.00$</span> */}
                    </div>
                </div>
                <div className="top-bar-content-header-right-right">
                    <button onClick={logOut}>log out</button>
                </div>  
            </div>
        </div>
    )
}