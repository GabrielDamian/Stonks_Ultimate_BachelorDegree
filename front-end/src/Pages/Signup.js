import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Signup()
{

    const [userData, setUserData] = useState({
        name: '',
        email:'',
        password: '',
        repeatPass: ''
    })
    useEffect(()=>{
        console.log("userData update",userData)
    },[userData])

    const SignupHandler = async ()=>{
        if(userData.name !== '' && userData.password != '' && (userData.password == userData.repeatPass))
        {
            console.log("ok siignup check")
            let resp = await axios.post(
                'http://localhost:1337/signup',
                userData
            )
            console.log("resp:", resp)
        }
        else 
        {
            console.log("wrong signup data")
        }
    }

    const handleInputChange = (e)=>{

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
        </div>
    )
} 
export default Signup;
