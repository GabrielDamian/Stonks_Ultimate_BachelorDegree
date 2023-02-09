import React,{useState, useEffect} from 'react';
import './Style/AddBlock.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import TextField from '@mui/material/TextField';
import CustomMonaco from '../Components/Organisms/CustomMonaco';
import Button from '@mui/material/Button';
import TopBar from '../Components/Organisms/TopBar';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {TranslateBlockStructureInPythonCode} from '../utils/utils.js';



const CurrentParamValues = ({values, removeValue})=>{
    useEffect(()=>{
        console.log("values deep:",values)
    },[values])
    return(
        <>
            {
                values.map((el)=>{
                    return(
                        <>
                            <p style={{border: '1px solid red'}}>{el.type}:{el.value}</p>
                            <p onClick={()=>removeValue(el)}>x</p>
                        </>
                    )
                })
            }
        </>
    )
}

const ParametersContainer = ({parameters,deleteParameter})=>{
    return(
        <div style={{
            height: '200px',
            border:'1px solid red'
        }}>
            {
                parameters.map((el, index)=>{
                    return(
                        <div style={{}}>
                            <p onClick={()=>deleteParameter(index)}>x</p>
                            <p>{el.paramName}-{el.paramKeyword}-{el.paramDesc}-{el.unnamed}</p>
                            <p>{el.values.map((el_value)=>{
                                return(`${el_value.type}-${el_value.value}->>`)
                            })}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}
function AddBlock({tabIndex,setTabs,tabs,userId})
{
    const TextAreaStyle={
        width: '100%',
    }
    const [layerData, setLayerData] = useState({
        name: '',
        keyword:'',
        desc:'',
        docLink:'',
        iconLink:''
    })
    const handleLayerDataChange = (e)=>[
        setLayerData((prev)=>{
            let copy = {...prev}
            copy[e.target.name] = e.target.value
            return copy
        })
    ]
    const [parameters, setParameters] = useState([]);

    const [currentNewParam, setCurrentNewParam] = useState({
        paramName: '',
        paramKeyword: '',
        paramDesc: '',
        unnamed: false,
        values: []
    })
    const [pyCode, setPyCode] = useState('None')

    useEffect(()=>{
        setPyCode(TranslateBlockStructureInPythonCode(layerData, parameters))
    },[layerData, parameters])

    const handleFieldChange = (e)=>{
        console.log("e:",e.target.value, e.target.name);
        
        setCurrentNewParam((prev)=>{
            let copy = {...prev}
            copy[e.target.name] = e.target.value
            return copy
        })
    }

    const [currentNewParamLoading, setCurrentNewParamLoading] = useState({
        type: 'String',
        value: ''
    })
    
    const handleCurrentNewParamChange = (e)=>{
        setCurrentNewParamLoading((prev)=>{
            let copy = {...prev}
            copy[e.target.name] = e.target.value
            return copy;
        })
    }
    const handleAddNewParamValue = ()=>{
        console.log("currentNewParamLoading:",currentNewParamLoading)

        if(currentNewParamLoading.value == '') {
            alert("please complete value field")
            return
        }

        setCurrentNewParam((prev)=>{
            let copy = {...prev}
            copy.values.push({...currentNewParamLoading})
            return copy
        })
        setCurrentNewParamLoading({
            type:"String",
            value: ''
        })
    }
    const handleRemoveNewParameter = (parameter)=>{
        console.log("handle delet:",parameter)
        let filtered = []
        currentNewParam.values.forEach((el)=>{
            console.log("el",el)
            console.log("parameter:", parameter);

            if(el.type == parameter.type && el.value == parameter.value) {
                // ignore
            }
            else 
            {
                filtered.push(el)
            }
        })
        console.log("filtered:",filtered)
        setCurrentNewParam((prev)=>{
            let copy = {...prev}
            copy.values = [...filtered]
            return copy
        })
    }

    const addNewParameter = ()=>{
        if(currentNewParam.paramName == '' || currentNewParam.paramKeyword == '' || currentNewParam.paramDesc == '')
        {
            alert("please complete all parameter fields")
        }
        else if(currentNewParam.values.length == 0)
        {
            alert("please add at least one parameter possible value")
        }
        else 
        {
            setParameters((prev)=>{
                let copy = [...prev]
                copy.push(currentNewParam)
                return copy
            })
            setCurrentNewParam({
                paramName: '',
                paramKeyword: '',
                paramDesc: '',
                unnamed: false,
                values: []
            })
        }
    }
    const deleteParameter = (parameterIndex)=>{
        let copy = []
        parameters.forEach((el, index)=>{
            if(index !== parameterIndex) copy.push(el)
        })
        setParameters(copy)
    }
    const createBlockRequest = async ()=>{

        let packedData = {layerData, parameters}
        console.log("packetData:", packedData)

        try{
            let response =await fetch('http://localhost:3001/create-layer', { 
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
                    console.log("err  private route:",response.status)
                }
                else 
                {
                    const data = await response.json();
                    console.log("add block response ok:", data)
                }
        }
        catch(err)
        {
            console.log("err:",err)
        }
    }
    const handleAddBlock = ()=>{
        console.log("add block")
        console.log("layerData:",layerData)
        console.log("parameteres:", parameters)
        if(layerData.name == '' || layerData.keyword == '' || layerData.desc == '' 
            || layerData.iconLink == '' || parameters.length == 0)
        {
            console.log("please complete all field or add at leat 1 parameters")
        }
        else 
        {
            console.log("add block OOK") 
            createBlockRequest()
        }
    }
    return(
        <div className='add-block-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className="add-block-content-data">
                    <div className='add-block-content-data-center'>
                        <div className='add-block-content-data-center-inputs'>
                            <div className='add-block-content-data-center-left'>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="Layer Name"
                                        sx={TextAreaStyle}
                                        name="name"
                                        value={layerData.name}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="Layer in code Name"
                                        sx={TextAreaStyle}
                                        name="keyword"
                                        value={layerData.keyword}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="Layer Description"
                                        sx={TextAreaStyle}
                                        name="desc"
                                        value={layerData.desc}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="Documentation Link"
                                        sx={TextAreaStyle}
                                        name="docLink"
                                        value={layerData.docLink}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="Icon link"
                                        sx={TextAreaStyle}
                                        name="iconLink"
                                        value={layerData.iconLink}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                            </div>
                            <div className='add-block-content-data-center-right'>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="paramName"
                                        sx={TextAreaStyle}
                                        value={currentNewParam.paramName}
                                        onChange={handleFieldChange}
                                        name="paramName"
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="paramKeyword"
                                        sx={TextAreaStyle}
                                        value={currentNewParam.paramKeyword}
                                        onChange={handleFieldChange}
                                        name="paramKeyword"
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="paramDesc"
                                        sx={TextAreaStyle}
                                        value={currentNewParam.paramDesc}
                                        onChange={handleFieldChange}
                                        name="paramDesc"
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <p>unnamed</p>
                                    <Select
                                        id="demo-simple-select"
                                        label="specialType"
                                        value={currentNewParam.unnamed}
                                        onChange={handleFieldChange}
                                        name="unnamed"
                                    >
                                        <MenuItem value={true}>true</MenuItem>
                                        <MenuItem value={false}>false</MenuItem>
                                    </Select>
                                    
                                </div>
                                <div className='content-data-center-row'>
                                    <Select
                                        id="demo-simple-select"
                                        label="specialType"
                                        value={currentNewParamLoading.type}
                                        onChange={handleCurrentNewParamChange}
                                        name="type"
                                    >
                                        <MenuItem value={"String"}>String</MenuItem>
                                        <MenuItem value={"Value"}>Value</MenuItem>
                                    </Select>
                                    <TextField
                                        id="outlined-required"
                                        label="param possible Value"
                                        sx={TextAreaStyle}
                                        value={currentNewParamLoading.value}
                                        onChange={handleCurrentNewParamChange}
                                        name="value"
                                    />
                                    <Button variant="contained" onClick={handleAddNewParamValue}>Add value</Button>
                                </div>
                                <div className='content-data-center-row'>
                                    <p style={{fontSize:'0.7rem'}}>*first value will be considered the default value</p>
                                    <p>Values:</p>
                                    <div
                                        style={{
                                            height: '200px',
                                            border: '1px solid blue'
                                        }}
                                    >
                                        <CurrentParamValues values={currentNewParam.values} removeValue={handleRemoveNewParameter}/>
                                    </div>
                                </div>
                                <Button variant="contained" onClick={addNewParameter}>Add Parameter</Button>

                            </div>
                            
                        </div>
                        <ParametersContainer parameters={parameters} deleteParameter={deleteParameter}/>
                        <div className='content-data-center-row' style={{height:'300px', padding:'20px'}}>
                            <CustomMonaco
                                editorValue={pyCode}
                                setEditorValue={()=>{}}
                            />
                        </div>
                        <div className='content-data-center-row' style={{
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center'
                        }}>
                            <Button variant="contained" onClick={handleAddBlock}>Add Block</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AddBlock;