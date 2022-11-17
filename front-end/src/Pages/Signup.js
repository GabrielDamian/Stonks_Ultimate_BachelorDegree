import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Signup()
{
    const cookies = new Cookies();

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email:'',
        password: '',
        repeatPass: ''
    })

    const [errors,setErrors] = useState('');

    useEffect(()=>{
        console.log("userData update",userData)
    },[userData])

    const SignupHandler = async ()=>{
        if(userData.name !== '' && userData.password != '' && (userData.password == userData.repeatPass))
        {
            try {
                const res = await fetch('http://localhost:3001/signup', { 
                  method: 'POST', 
                  body: JSON.stringify({ 
                    name: userData.name,
                    email:userData.email, 
                    password: userData.password 
                }),
                  headers: {'Content-Type': 'application/json'}
                });

                console.log("fill resp:",res)
                const data = await res.json();
                if(data.errors)
                {
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
                else 
                {
                    console.log("body:", data)
                    let token = data.token;
                    cookies.set('jwt',token,{secure: true, sameSite: 'none'})
                    console.log("raw token:", token)
                    navigate(`/`);
                }
                console.log("datA:",data)
              }
              catch (err) {
                console.log(err);
              }
        }
        else 
        {
            setErrors('Please complete all fields!')
            console.log("wrong signup data")
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
        <div>
            <input name="name" type="text" placeholder='username' onChange={handleInputChange}></input>
            <input name="email" type="text" placeholder='email' onChange={handleInputChange}></input>
            <input name="password" type="password" placeholder='password' onChange={handleInputChange}></input>
            <input name="repeatPass" type="password" placeholder='repeatPass' onChange={handleInputChange}></input>
            <button onClick={SignupHandler}>signup</button>
            <span>{errors}</span>
        </div>
    )
} 
export default Signup;
