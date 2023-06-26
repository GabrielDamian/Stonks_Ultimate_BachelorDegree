import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {Link} from 'react-router-dom';
import LogoIcon from '../Media/logo.png';
function Signup()
{
    const cookies = new Cookies();

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email:'',
        username:'',
        password: '',
        repeatPass: ''
    })

    const [errors,setErrors] = useState('');

    
    const redirectTo = (des)=>{
        navigate(des)
    }

    const SignupHandler = async ()=>{
        if(userData.name !== '' && userData.password != '' && (userData.password == userData.repeatPass))
        {
            try {
                const res = await fetch('http://localhost:3001/signup', { 
                  method: 'POST', 
                  body: JSON.stringify({ 
                    email:userData.email, 
                    password: userData.password ,
                    username: userData.username
                }),
                  headers: {'Content-Type': 'application/json'}
                });

                const data = await res.json();
                if(data.errors)
                {
                    let extractErrors = ""
                    Object.keys(data.errors).forEach((key)=>{
                        if(data.errors[key] !== '')
                        {
                            extractErrors += data.errors[key] + " // "
                        }
                    })

                    setErrors(extractErrors)

                }
                else 
                {
                    let token = data.token;
                    cookies.set('jwt',token,{secure: true, sameSite: 'none'})
                    alert("Succees signup, redirecting to login!")
                    navigate(`/login`);
                }
              }
              catch (err) {
                console.error("Signup:", err)
              }
        }
        else 
        {
            setErrors('Please complete all fields!')
        }
    }

    const handleInputChange = (e)=>{
        
        setErrors('');
        setUserData((prev)=>{
            let newState = {...prev}
            newState[e.target.name] = e.target.value
            return newState
        })
    }

    return(
        <div 
            style={{
                backgroundImage: `url('${process.env.PUBLIC_URL}/signup.png')`
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
                        <span>Sign up </span> now!
                    </h1>
                    <p class="login__description">
                        Please sign up to continue.
                    </p>
                </div>

                <div>
                    <div class="login__inputs">
                        <div>
                            <label for="" class="login__label">Name</label>
                            <input name="name" type="text" placeholder='Name' onChange={handleInputChange} required class="login__input"/>
                        </div>
                        <div>
                            <label for="" class="login__label">Email</label>
                            <input name="email" type="text" placeholder='Email' onChange={handleInputChange} required class="login__input"/>
                        </div>

                        <div>
                            <label for="" class="login__label">Username</label>
                            <input name="username" type="text" placeholder='Username' onChange={handleInputChange} required class="login__input"/>
                        </div>

                        <div>
                            <label for="" class="login__label">Password</label>
                            <input name="password" type="password" placeholder='Password' onChange={handleInputChange} required class="login__input"/>
                        </div>
                        <div>
                            <label for="" class="login__label">Repeat Password</label>
                            <input name="repeatPass" type="password" placeholder='repeatPass' onChange={handleInputChange} required class="login__input"/>
                        </div>
                       
                    </div>
                </div>

                <div>
                    <div class="login__buttons">
                        <button class="login__button" onClick={SignupHandler}>Sign up</button>
                        <button class="login__button login__button-ghost" onClick={()=>redirectTo('/login')}>Login</button>
                        
                    </div>
                    <p className='error-login-signup'>{errors}</p>
                </div>
		    </form>

            </div>
            </div>
        </div>
    )
} 
export default Signup;
