import React, {useState,useEffect, Children } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedRoute(
    {
        children
    }
){
    
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    
    const [userId, setUserId] = useState(null);
    
    const apiCheck = async ()=>{
        let testSring = JSON.stringify({jwt: Cookies.get('jwt')})
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
                    return navigate('/login')
                }
                else 
                {
                    const data = await response.json();
                    setUserId(data.id);
                    setIsLoading(false);
                }
        }
        catch(err)
        {
            console.error("Protected route:",err)
        }
    }

    useEffect(()=>{
       apiCheck()
    },[])

    const redenerChild = (children)=>{
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

 
 
 
 
 
 
 
 
 
 
 
 
 
 

