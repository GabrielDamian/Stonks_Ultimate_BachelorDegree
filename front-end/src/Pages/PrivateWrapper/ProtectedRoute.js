import React, {useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute(
    {
        children
    }
){
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const apiCheck = async ()=>{
        //fetch for 'check-token' before rendering the component
        console.log("test") 
        try{
            let response =await fetch('http://localhost:3001/check-token', { 
                    method: 'POST', 
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
                    console.log("err:",response.status)
                    let data = await response.json()
                    return navigate('/login')
                }
                else 
                {
                    const data = await response.json();
                    console.log("ok data:", data)
                    setIsLoading(false);
                }

                
            // const res = await fetch('http://localhost:3001/check-token', { 
            //     method: 'POST', 
            //     headers: {'Content-Type': 'application/json'}
            //   });
        }
        catch(err)
        {
            console.log("err:",err)
        }
    }
    useEffect(()=>{
       apiCheck()
    },[])

    
    const decideComponent = (currentState)=>{
        switch(currentState)
        {
            case true: 
                return <LoadingComponent />
            case false: 
                return children
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