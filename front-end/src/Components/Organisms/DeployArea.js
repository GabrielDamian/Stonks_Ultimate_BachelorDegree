import React,{useEffect, useState} from 'react';
import './DeployArea.css'
import Checkbox from '@mui/material/Checkbox';
import CustomButton from '../Atoms/CustomButton';
import {CssTextField} from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const marketsTemp =['BTC-USD','ETH-USD','AAPL','GOOG']
const initMarketState = (marketsSource)=>{
    let marketObj = {}
    marketsSource.forEach((el)=>{
        marketObj[el] = false
    })
    return marketObj
}


export default function DeployArea ({editorValue})
{
    const navigate = useNavigate();

    const [fields, setFields] = useState({
        name: '',
        description: '',
    })
    const [markets, setMarkets] = useState(initMarketState(marketsTemp))
    
    const [deployStatus, setDeployStatus] = useState("Status: Creating model schema");
    const [fieldsError, setFieldsError] = useState('');
    
    const deployCodeRequest = async (packedData)=>{
        try{
            let response =await fetch('http://localhost:3001/deploy-code', { 
                    method: 'POST', 
                    body: JSON.stringify(packedData),
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
                    setDeployStatus("Can't deploy!")
                }
                else 
                {
                    const data = await response.json();
                    console.log("DATa respo:",data)
                    setDeployStatus("Status: Deployment successfully, redirecting to overview..");
                    setTimeout(()=>{
                        navigate('/overview')
                    },3000)
                }
        }
        catch(err)
        {
            console.error("DeployArea:", err)
        }
    }

    const handleFieldsChange = (who, value)=>{
        setFieldsError('');
        setFields((prev)=>{
            let prevCopy = {...prev}
            prevCopy[who] = value
            return prevCopy
        })
    }

    const handleCheckBoxChange = (who)=>{
        setFieldsError('');
        setMarkets((prev)=>{
            let prevCopy = {...prev}
            let needsToBe = !prev[who]

            Object.keys((prevCopy)).forEach((oldKey)=>{
                console.log("old key:", oldKey)
                prevCopy[oldKey] = false;
            })
            prevCopy[who] = needsToBe

            console.log("prevCopy:",prevCopy)
            return prevCopy
        })
    }
    const checkWeirdValueField = (input, myName)=>{
        if(input.length < 3) {
            return false
        }
    }

    const handleDeployAction = ()=>{

        let ripCheck = false;
        Object.keys(fields).forEach((el)=>{
            if(checkWeirdValueField(fields[el], el) == false){
                ripCheck = true
            }
        })
        if(ripCheck == true){
            alert("Fields should have at least 5 chars")
            return
        }

        let marketsSelected = []
        Object.keys(markets).forEach((el)=>{
            if(markets[el] == true)
            {
                marketsSelected.push(el)
            }
        })
        if(marketsSelected.length == 0 || fields.name == '' || fields.description == '')
        {
            setFieldsError("Please complete all fields");
            return
        }
        else if(marketsSelected.length > 1)
        {
            setFieldsError("Please select one single market!");
            return
        }
        else 
        {
            let packet = {
                name: fields.name,
                description: fields.description,
                market: marketsSelected[0],
                code: editorValue
            }

            setDeployStatus("Deployment Started")
            deployCodeRequest(packet)
        }
    }
   
    return(
        <div className='deployment-area-container'>
            <div className='ide-deploy-header'>
                <span>Deployment Area:</span>
            </div>
            <div className='ide-deploy-content'>
                {
                    Object.keys(fields).map((el)=>{
                        return(
                            <div className='ide-deploy-field'>
                                <CssTextField 
                                    id="outlined-basic" 
                                    label={el} 
                                    variant="outlined" 
                                    sx={{
                                        "& .MuiFormLabel-root": {
                                            color: '#bcfe2f'
                                        },
                                        "& .MuiFormLabel-root.Mui-focused": {
                                            color: '#bcfe2f'
                                        }
                                    }}   
                                    value={fields.el}
                                    onChange={(e)=>handleFieldsChange(el,e.target.value)}
                                />
                            </div>
                        )
                    })
                }
            <div className='ide-deploy-field' style={{flexDirection: 'column'}}>
                {
                    Object.keys(markets).map((el)=>{
                        return(
                            <div className='ide-deploy-field-row'>
                                 <input 
                                    id={el}
                                    type="radio" 
                                    value={el}  
                                    checked={markets[el]}
                                    onChange={(e)=>{
                                        handleCheckBoxChange(el)
                                    }}
                                />
                                <span
                                    style={{
                                        borderBottom: markets[el] == true ? '2px solid var(--lime)':'2px solid transparent'
                                    }}
                                >{el}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className='ide-deploy-action'>
                <CustomButton text="Deploy" onClick={handleDeployAction}/>
            </div>
             <div className='ide-deploy-field' style={{flexDirection: 'column'}}>
                <p>{deployStatus}</p>
                <p>{fieldsError}</p>
            </div>
        </div>
        </div>
    )
}


