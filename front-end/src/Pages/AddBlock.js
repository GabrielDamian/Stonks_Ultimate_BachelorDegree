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
import {CssTextField} from '../utils/utils';
import DeleteIcon from '../Media/Icons/remove.png';
import CustomButton from '../Components/Atoms/CustomButton';


const CurrentParamValues = ({values, removeValue})=>{
    
    return(
        <div className="content-data-center-row-parameters-current-params">
            {
                values.map((el)=>{
                    return(
                        <div className='content-data-center-row-parameters-current-params-el'>
                            <p>{el.type}: {el.value}</p>
                            <img src={DeleteIcon}  onClick={()=>removeValue(el)}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

const ParametersContainer = ({parameters,deleteParameter})=>{
    return(
        <div className='add-block-content-data-center-inputs-parameters-container'>
            <div style={{marginBottom:'10px'}}>
                <span>Parameters:</span>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
            {
                parameters.map((el, index)=>{
                    return(
                        <div className='add-block-content-data-center-inputs-parameters-container-el'>
                            <img
                                src={DeleteIcon}  
                                className='add-block-content-data-center-inputs-parameters-container-el-del'
                                onClick={()=>deleteParameter(index)}
                            />

                            <p>Name: {el.paramName}</p>
                            <p>Keyword: {el.paramKeyword}</p>
                            <p>Description: {el.paramDesc}</p>
                            <p>Unnamed: {el.unnamed}</p>
                            <p>Values: {el.values.map((el_value)=>{
                                return(`${el_value.value}(${el_value.type}) `)
                            })}</p>
                        </div>
                    )
                })
            }
        </div>
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
        let filtered = []
        currentNewParam.values.forEach((el)=>{

            if(el.type == parameter.type && el.value == parameter.value) {
                // ignore
            }
            else 
            {
                filtered.push(el)
            }
        })
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
                    console.error("AddBlock:", response)
                }
                else 
                {
                    const data = await response.json();
                }
        }
        catch(err)
        {
            console.error("AddBlock:", err)
        }
    }
    const handleAddBlock = ()=>{
        if(layerData.name == '' || layerData.keyword == '' || layerData.desc == '' 
            || layerData.iconLink == '' || parameters.length == 0)
        {
            alert("Please complete all field or add at leat 1 parameter.")
        }
        else 
        {
            createBlockRequest()
        }
    }

    const TextFieldsStyled = {
        input:{color:'var(--lime)'},
        color: 'var(--lime)',
        width: '100%',
        "& .MuiFormLabel-root": {
            color: '#bcfe2f'
        },
        "& .MuiFormLabel-root.Mui-focused": {
            color: '#bcfe2f'
        }
    }
    const SelectCustomStyle = {
        width: '100%',
        color: "white",
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(228, 219, 233, 0.25)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(228, 219, 233, 0.25)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(228, 219, 233, 0.25)',
        },
        '.MuiSvgIcon-root ': {
          fill: "white !important",
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
                                    <CssTextField
                                        id="outlined-required"
                                        label="Layer Name"
                                        sx={TextFieldsStyled}
                                        name="name"
                                        value={layerData.name}
                                        onChange={handleLayerDataChange}
                                        variant="outlined" 

                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <CssTextField
                                        id="outlined-required"
                                        label="Layer in code Name"
                                        sx={TextFieldsStyled}
                                        name="keyword"
                                        value={layerData.keyword}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <CssTextField
                                        id="outlined-required"
                                        label="Layer Description"
                                        sx={TextFieldsStyled}
                                        name="desc"
                                        value={layerData.desc}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <CssTextField
                                        id="outlined-required"
                                        label="Documentation Link"
                                        sx={TextFieldsStyled}
                                        name="docLink"
                                        value={layerData.docLink}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <CssTextField
                                        id="outlined-required"
                                        label="Icon link"
                                        sx={TextFieldsStyled}
                                        name="iconLink"
                                        value={layerData.iconLink}
                                        onChange={handleLayerDataChange}
                                    />
                                </div>
                            </div>
                            <div className='add-block-content-data-center-right'>
                                <div className='content-data-center-row'>
                                    <CssTextField
                                        id="outlined-required"
                                        label="paramName"
                                        sx={TextFieldsStyled}
                                        value={currentNewParam.paramName}
                                        onChange={handleFieldChange}
                                        name="paramName"
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <CssTextField
                                        id="outlined-required"
                                        label="paramKeyword"
                                        sx={TextFieldsStyled}
                                        value={currentNewParam.paramKeyword}
                                        onChange={handleFieldChange}
                                        name="paramKeyword"
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <CssTextField
                                        id="outlined-required"
                                        label="paramDesc"
                                        sx={TextFieldsStyled}
                                        value={currentNewParam.paramDesc}
                                        onChange={handleFieldChange}
                                        name="paramDesc"
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <p
                                        style={{
                                            marginRight: '20px',
                                            width: '15%',
                                            textAlign: 'center'
                                        }}
                                    >Unnamed Type:</p>
                                    <Select
                                        id="demo-simple-select"
                                        label="specialType"
                                        value={currentNewParam.unnamed}
                                        onChange={handleFieldChange}
                                        name="unnamed"
                                        sx={SelectCustomStyle}
                                    >
                                        <MenuItem value={true}>true</MenuItem>
                                        <MenuItem value={false}>false</MenuItem>
                                    </Select>
                                    
                                </div>
                                <div className='content-data-center-row'>
                                    <p
                                        style={{
                                            marginRight: '20px',
                                            width: '15%',
                                            textAlign: 'center'
                                        }}
                                    >Type-Value Pairs:</p>
                                    <Select
                                        id="demo-simple-select"
                                        label="specialType"
                                        value={currentNewParamLoading.type}
                                        onChange={handleCurrentNewParamChange}
                                        name="type"
                                        sx={{
                                            ...SelectCustomStyle,
                                            width: '28%',
                                            marginRight: '20px'
                                        }}
                                    >
                                        <MenuItem value={"String"}>String</MenuItem>
                                        <MenuItem value={"Value"}>Value</MenuItem>
                                    </Select>
                                    <CssTextField
                                        id="outlined-required"
                                        label="Value"
                                        sx={{
                                            ...TextFieldsStyled,
                                            width:'28%'
                                        }}
                                        value={currentNewParamLoading.value}
                                        onChange={handleCurrentNewParamChange}
                                        name="value"
                                    />
                                    <div
                                        style={{
                                            width: '28%',
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <CustomButton text="Add value" onClick={handleAddNewParamValue}/>
                                    </div>
                                </div>
                                <div 
                                style={{
                                    padding: '10px',
                                    flexDirection: 'column',
                                    border: '2px solid var(--border)',
                                    alignItems: 'flex-start',
                                    color: 'var(--font)'
                                }}
                                className='content-data-center-row'>
                                    <div className="content-data-center-row-parameters-header">
                                        <span
                                            style={{
                                                fontSize: '1rem',
                                                padding: '0px'
                                            }}>
                                            Parameter Values: <br/><span style={{fontSize: '0.8rem'}}>*first value will be considered the default value</span>
                                        </span>
                                    </div>
                                    <div className="content-data-center-row-parameters">
                                        <CurrentParamValues values={currentNewParam.values} removeValue={handleRemoveNewParameter}/>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <CustomButton text="Add Parameter" onClick={addNewParameter}/>
                                </div>
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
                            <CustomButton text="Add Block" onClick={handleAddBlock}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AddBlock;