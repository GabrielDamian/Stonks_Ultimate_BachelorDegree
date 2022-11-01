import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Login()
{
    const [userData, setUserData] = useState({
        email:'',
        password: '',
    })

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
            let resp = await axios.post(
                'http://localhost:1337/login',
                userData
            )
            console.log("data:",resp.data)
            if(resp.data.status == 'ok')
            {
                console.log("login succesful, token:", resp.data.token)
            }
            else 
            {
                console.log("login failed")
            }
        }
        else 
        {
            console.log("empty fields")
        }
    }
    return(
        <div>
            <input name="email" type="text" placeholder='email' onChange={handleInputChange}></input>
            <input name="password" type="password" placeholder='password' onChange={handleInputChange}></input>
            <button onClick={LoginHandler}>Login</button>
        </div>
    )
} 
export default Login;
