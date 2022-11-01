import React,{useState, useEffect} from 'react'
import axios from 'axios';

export default function PrivateRoute()
{
    const [value,setValue] = useState('');

    const handleTokenCheck = async ()=>{
        let resp = await axios.post(
            'http://localhost:1337/check-token',
            {token:value}
            )
        console.log("resp:",resp)

    }
    const handleInputChange= (e)=>{
        setValue(e.target.value);
    }
    return(
        <>
            <input type="text" onChange={handleInputChange} />
            <button onClick={handleTokenCheck}>Check</button>
        </>
    )
}
