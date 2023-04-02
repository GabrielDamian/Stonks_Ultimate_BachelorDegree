import React, {useState, useEffect } from 'react';
import CustomMonaco from './CustomMonaco';
import './NodeInfo.css';
import Modal from '@mui/material/Modal';
import CustomButton from '../Atoms/CustomButton';
import Box from '@mui/material/Box';

import { BarChart } from './BarChart.tsx';


export default function NodeInfo({nodeData})
{
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
            let localCopy = {
                BuildName: nodeData.buildName,
                Description: nodeData.description,
                Market: nodeData.market,
                Code: nodeData.code
            }
            if(nodeData.status !== undefined)
            {
                let statusConcat = nodeData.status.split(",")
                statusConcat.forEach((el)=>{
                    let pairKeyValue = el.split(":")
                    localCopy[pairKeyValue[0].trim()] = pairKeyValue[1]
                })

            }
            console.log("localCopy:",localCopy)

            setLocalData(localCopy)
            setAverage(extractAverage(nodeData.initTests))
        }
    },[nodeData])
    
    let extractNodeData = (source)=>{
        let codeObjIndex = undefined;

        let temp = []
        Object.keys(source).forEach((el, index)=>{
            if(el == "Code")
            {
                codeObjIndex = index;
            }
            let obj = {
                key: el,
                content: source[el]
            }
            temp.push(obj)
        })


        console.log("temp:",temp)
        console.log("codeObjIndex:",codeObjIndex)

        function moveElement(array, fromIndex, toIndex) {
            const element = array.splice(fromIndex, 1)[0];
          
          
            array.splice(toIndex, 0, element);
          
            return array;
          }
        if(codeObjIndex !== undefined)
        {
            temp = moveElement(temp, codeObjIndex, temp.length)
        }

        return temp
    }   
    const [average, setAverage] = useState('_%');
    
    const extractAverage = (initTestsParam)=>{
        if(initTestsParam !== undefined)
        {
            let totalDif = 0;
            let count = 0;
            initTestsParam.forEach((el)=>{
                let split = el.interval.split(" ")
                let values = [Number(split[0]), Number(split[1])]

                let valueItem = undefined
                if(values[0] > 0)
                {
                    valueItem = values[0]
                }
                else 
                {
                    valueItem = values[1]
                }
                
                totalDif +=  Number(el.value) * valueItem;
                count += Number(el.value)
            })

            let average = totalDif/count;
            if (average !== NaN)
            {
                return average.toFixed(2)
            }
        }
       
        return '_'
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
                        <span>{average} units</span>
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

    const extractLayers = (sourceData)=>{
        if(sourceData !== undefined)
        {
            const firstWord = "___ModelSeparatorStart___";
            const secondWord = "#___ModelSeparatorEnd___";
            const startPos = sourceData.indexOf(firstWord) + firstWord.length;
            const endPos = sourceData.indexOf(secondWord);
            const extractedText = sourceData    .substring(startPos, endPos);
    
            return extractedText
        }
        else {
            return sourceData
        }
    }
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
                    <CustomMonaco  editorValue={(extractLayers(codeSource))} setEditorValue={()=>{}} options={{readOnly: true}}/>
                </Box>
            </Modal>
        </div>
    )
}