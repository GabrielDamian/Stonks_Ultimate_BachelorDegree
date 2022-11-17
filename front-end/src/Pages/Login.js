import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
function Login()
{
    const cookies = new Cookies();
    const navigate = useNavigate();

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
                console.log("full res:",res)
                console.log("header:", res.headers)
                console.log("document:",document.cookies)

                const data = await res.json();
                console.log(data);
                if (data.errors) {
                    let extractErrors = ""
                    Object.keys(data.errors).forEach((key)=>{
                        console.log("key:", data.errors[key])    
                        if(data.errors[key] !== '')
                        {
                            extractErrors += data.errors[key] + " // "
                        }
                    })

                    setErrors(extractErrors)
                    console.log("extracted:",extractErrors)
                }
                else{
                    //set cookies
                    console.log("body:", data)
                    let token = data.token;
                    cookies.set('jwt',token,{secure: true, sameSite: 'none'})
                    console.log("raw token:", token)
                    navigate(`/`);
                }
              }
              catch (err) {
                console.log(err);
              }
        }
        else 
        {
            setErrors("Please complete all fields!")
            console.log("empty fields")
        }
    }

    const test = async ()=>{
        console.log("TEST")

        const res = await fetch('http://localhost:3000/private', { 
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            credentials: 'include'
          });
    }

    return(
        <div>
            <input name="email" type="text" placeholder='email' onChange={handleInputChange}></input>
            <input name="password" type="password" placeholder='password' onChange={handleInputChange}></input>
            <button onClick={LoginHandler}>Login</button>
            <span>{errors}</span>
            <button onClick={test}>TEST</button>
        </div>
    )
} 
export default Login;
