import React,{useState} from 'react';
import './DeployArea.css'
import Checkbox from '@mui/material/Checkbox';
import CustomButton from '../Atoms/CustomButton';
import {CssTextField} from '../../utils/utils';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const marketsTemp =['BTC-USD','ETH-USD','AAPL','GOOG']
const initMarketState = (marketsSource)=>{
    let marketObj = {}
    marketsSource.forEach((el)=>{
        marketObj[el] = false
    })
    return marketObj
}


function DeployArea ({editorValue})
{

    const [fields, setFields] = useState({
        name: '',
        description: '',
    })
    const [markets, setMarkets] = useState(initMarketState(marketsTemp))

    const [deployStatus, setDeployStatus] = useState('Status');
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
                    setDeployStatus("Deployment successfully, check overview");
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
            prevCopy[who] = !prev[who]
            return prevCopy
        })
    }

    const handleDeployAction = ()=>{
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
                                <Checkbox 
                                    sx={{
                                        color: '#b0afb2',
                                        '&.Mui-checked': {
                                        color: '#bcfe2f',
                                        },
                                    }}

                                    checked={markets.el}
                                    onChange={(e)=>{
                                        handleCheckBoxChange(el)
                                    }}
                                    {...label}
                                 />
                                <span>{el}</span>
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
export default DeployArea;

