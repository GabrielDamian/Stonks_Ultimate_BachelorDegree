import React, {useState, useEffect } from 'react';
import CustomMonaco from './CustomMonaco';
import './NodeInfo.css';
import Modal from '@mui/material/Modal';
import CustomButton from '../Molecules/CustomButton';
import Box from '@mui/material/Box';

import { BarChart } from './BarChart.tsx';


export default function NodeInfo({nodeData})
{
    useEffect(()=>{
        console.log("nodeData:",nodeData)

    },[nodeData])
    const [localData, setLocalData] = useState({
        BuildName: 'x',
        Status: 'x',
        Description: 'x',
        Market: 'x',
        Code: 'x'
    })
    useEffect(()=>{
        if(nodeData !== undefined)
        {
            setLocalData(({
                BuildName: nodeData.buildName,
                Status: nodeData.status,
                Description: nodeData.description,
                Market: nodeData.market,
                Code: nodeData.code
            }))
        }
    },[nodeData])
    
    let extractNodeData = (source)=>{
        let temp = []
        Object.keys(source).forEach((el)=>{
            let obj = {
                key: el,
                content: source[el]
            }
            temp.push(obj)
        })

        return temp
    }   

    return(
        <div className="node-info-left">
            <div className='node-info-container'>
                <div className='node-info-container-header'>
                    <span>Details:</span>
                </div>
                <div className='node-info-container-content'>
                {
                    extractNodeData(localData).map((el)=>{
                        return <TempDisplayNodeItem keyItem={el.key} content={el.content}/>
                    })
                }
                </div>
            </div>
            <div className='node-info-container-stats-bar'>
                <div className='node-info-container-stats-bar-header'>
                    <span>Model Tests</span>
                </div>
                <div className='node-info-container-stats-bar-ratio'>
                    <div className='node-info-container-stats-bar-key'>
                        <span>Model Ratio: </span>
                    </div>
                    <div className='node-info-container-stats-bar-value'>
                        <span>53%</span>
                    </div>
                </div>
                <div 
                    style={{
                        width: '100%',
                        height: '80%',
                        display:'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <div className='node-info-container-stats-bar-barchart'>
                        <BarChart pairs={nodeData !== undefined && nodeData.initTests !== undefined ? nodeData.initTests : []}/>
                    </div>
                    </div>
            </div>
        </div>
        
    )
}

const TempDisplayNodeItem = ({keyItem,content})=>{
    return (
            keyItem === 'Code'? <CodeEditorNodeDisplay codeSource={content}/>:
            <div className='node-info-temp-item'>
                <div className='node-info-temp-item-key'>
                <span>{keyItem}:</span>
                </div>
                <div className='node-info-temp-item-content'>
                    <span>{content}</span>
                </div>
            </div>
    )
}
const CodeEditorNodeDisplay = ({codeSource})=>{

    const style = {
        width: '70vw',
        height: '70vh',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        margin:0,
        padding:0
      };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <div 
            style={{
                padding: '10px',
            }}
            className='node-info-temp-item-code'>
            <CustomButton onClick={handleOpen} text="Code"/>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography> */}
                    <CustomMonaco  editorValue={codeSource} setEditorValue={()=>{}} options={{readOnly: true}}/>
                </Box>
            </Modal>
        </div>
    )
}