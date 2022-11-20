import React, {useState,useEffect, Children } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function ProtectedRoute(
    {
        children
    }
){
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    
    const apiCheck = async ()=>{
        console.log("check cokie before send:",Cookies.get('jwt'))
        let testSring = JSON.stringify({jwt: Cookies.get('jwt')})
        console.log("test json:", testSring);
        
        try{
            let response =await fetch('http://localhost:3001/check-token', { 
                    method: 'POST', 
                    body: JSON.stringify({token: Cookies.get('jwt')}),
                    headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Credentials':true
                    },
                    withCredentials: true,
                    credentials: 'include'
                })
                if(!response.ok)
                {
                    console.log("err  private route:",response.status)
                    return navigate('/login')
                }
                else 
                {
                    const data = await response.json();
                    console.log("ok data:", data)
                    setUserId(data.id);
                    setIsLoading(false);
                }

          
        }
        catch(err)
        {
            console.log("err:",err)
        }
    }

    useEffect(()=>{
       apiCheck()
    },[])

    const redenerChild = (children)=>{
        // return children
        return Children.map(children,(child)=>{
            return (
                <child.type
                    {...child.props}
                    userId={userId}
                />
            )
        })
    }

    const decideComponent = (currentState)=>{
        switch(currentState)
        {
            case true: 
                return <LoadingComponent />
            case false: 
                return (<>
                    {redenerChild(children)}
                </>)
            default:
                return <LoadingComponent />
        }
    }

    return(
        <>
            {decideComponent(isLoading)}
        </>
    )
}


const LoadingComponent = ()=>{
    return(
        <p>Loading</p>
    )
}

 
 
 
 
 
 
 
 
 
 
 
 
 
 

