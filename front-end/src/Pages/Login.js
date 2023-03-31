import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {Link} from 'react-router-dom';
import LogoIcon from '../Media/logo.png';
import './Style/Login.css';

function Login()
{
    const cookies = new Cookies();

    const [userData, setUserData] = useState({
        email:'',
        password: '',
    })
    const [errors,setErrors] = useState('');

    const handleInputChange = (e)=>{

        setUserData((prev)=>{
            let newState = {...prev}
            newState[e.target.name] = e.target.value
            return newState
        })
    }

    const LoginHandler = async()=>{
        if(userData.email !== '' && userData.password !== '')
        {
            try {
                const res = await fetch('http://localhost:3001/login', { 
                  method: 'POST', 
                  
                  body: JSON.stringify({ 
                    email: userData.email,
                    password: userData.password
                 }),
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Credentials':true
                    },
                    withCredentials: true,
                    credentials: 'include'
                });

                const data = await res.json();
                if (data.errors) {
                    let extractErrors = ""
                    Object.keys(data.errors).forEach((key)=>{
                        if(data.errors[key] !== '')
                        {
                            extractErrors += data.errors[key] + " // "
                        }
                    })

                    setErrors(extractErrors)
                }
                else{
                    //set cookies
                    let token = data.token;
                    cookies.set('jwt',token,{secure: true, sameSite: 'none'})
                    navigate(`/overview`);
                }
              }
              catch (err) {
                console.error("Login:", err)
              }
        }
        else 
        {
            setErrors("Please complete all fields!")
        }
    }

    const test = async ()=>{

        const res = await fetch('http://localhost:3000/private', { 
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            credentials: 'include'
          });
    }

    const navigate = useNavigate();
    const redirectTo = (des)=>{
        navigate(des)
    }

    return(
        <div 
            style={{
                backgroundImage: `url('${process.env.PUBLIC_URL}/login.png')`
            }}
            className='login-container'>
            <div className='hero-top-bar'>
                <div className='hero-top-bar-logo'>
                    <img onClick={()=>redirectTo('/')} src={LogoIcon} alt="logo" />
                </div>
                <div className='hero-top-bar-navigation'>
                    <div className='hero-top-bar-navigation-buttons'>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                    </div>
                </div>
            </div>
            <div className='login-container-page'>
            <div className='login-container-page-left'>

            </div>
            <div className='login-container-page-right'>
            
            <form action="" class="login__form" onSubmit={(e)=>{e.preventDefault()}}>
                <div>
                    <h1 class="login__title">
                        <span>Welcome</span> Back!
                    </h1>
                    <p class="login__description">
                        Please login to continue.
                    </p>
                </div>

                <div>
                    <div class="login__inputs">
                        <div>
                            <label for="" class="login__label">Email</label>
                            <input name="email" type="text" onChange={handleInputChange} placeholder="Enter your email address" required class="login__input"/>
                        </div>

                        <div>
                            <label for="" class="login__label">Password</label>

                            <div class="login__box">
                                <input name="password" type="password" placeholder='password' onChange={handleInputChange} required class="login__input" id="input-pass"/>
                                <i class="ri-eye-off-line login__eye" id="input-icon"></i>
                            </div>
                        </div>
                    </div>

                    {/* <div class="login__check">
                        <input type="checkbox" class="login__check-input"/>
                        <label for="" class="login__check-label">Remember me</label>
                    </div> */}
                </div>

                <div>
                    <div class="login__buttons">
                        <button class="login__button" onClick={LoginHandler}>Log In</button>
                        <button class="login__button login__button-ghost" onClick={()=>redirectTo('/signup')}>Sign Up</button>
                        
                    </div>

                    {/* <a href="#" class="login__forgot">Forgot Password?</a> */}
                    <p className='error-login-signup'>{errors}</p>
                </div>
		    </form>

            </div>
            </div>
        </div>
    )
} 
export default Login;
