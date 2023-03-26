import React,{useState,Component, useEffect} from 'react';
import './Style/NodeStore.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import DragArea from '../Components/Organisms/DragArea';
import DeployArea from '../Components/Organisms/DeployArea';
import TopBar from '../Components/Organisms/TopBar';


const magicTranslatorToPython = (source)=>{
    
    let finalCode = ""
    let selected = source.selected;

    selected.forEach((layer)=>{
        let layer_row = `        model.add(${layer.layerKeyword}(`
        layer.parameters.forEach((parameter)=>{
            
            let formatParametersCalc = (paramsFormat)=>{
                return paramsFormat.split("___").map((el)=>{
                    return el.split("--")
                })
            }

            let formatParameters = formatParametersCalc(parameter.parameterValues)

            if(parameter.selectedValue !== undefined)
            {
                //cauta tipul valorii in parameterValues pentru
                let findParam = ''

                formatParameters.forEach((findParam_el)=>{
                    
                    if(findParam_el[1] == parameter.selectedValue)
                    {
                        if(findParam_el[0] == 'String')
                        {
                            findParam += `${parameter.paramKeyword}='${findParam_el[1]}', `
                        }
                        else 
                        {
                            findParam += `${parameter.paramKeyword}=${findParam_el[1]}, `
                        }
                    }
                })
                layer_row += findParam
            }
            else 
            {
                if(formatParameters[0][0] == 'String')
                {
                    layer_row += `${parameter.paramKeyword}='${formatParameters[0][1]}', `
                }
                else 
                {
                    layer_row += `${parameter.paramKeyword}=${formatParameters[0][1]}, `
                }
            }
        })

        layer_row = layer_row.slice(0,-2)     
        layer_row = layer_row +  `))\n`
        finalCode += layer_row
    })

    return  finalCode
}

function NodeStore({tabIndex,setTabs,tabs,userId})
{
    let [codeState, setCodeState] = useState({
        items: [],
        selected: []
    });

    const deleteItem =(itemId)=>{
        setCodeState((prev)=>{
            let deleted = [...prev.selected].filter((el)=>{
                if(el.id == itemId)
                    return false
                return true
            })
            let returnObj ={
                items: [...prev.items],
                selected: [...deleted]
            }
            return returnObj;
        })
    }


    const replicateItem = (itemElParam, indexInItems)=>{
        let itemEl = {...itemElParam}
        itemEl.id = itemElParam.id + String(Math.floor(Math.random() * 11)+10)

        setTimeout(()=>{
            const insertAtCustomIndex = (arr, index, newItem) => [
                ...arr.slice(0, index),
                newItem,
                ...arr.slice(index)
              ]
    
            setCodeState((prev)=>{
                let stateCopy = {...prev}
                let param = [...stateCopy.items]
    
                param = insertAtCustomIndex(param, indexInItems, itemEl)
                
                stateCopy.items = [...param]
                return stateCopy
            })
        })
        
    }

    let [translatedLayersIntoCode, setTranslatedLayersIntoCode] = useState("");
    useEffect(()=>{
        console.log("translatedLayersIntoCode:",translatedLayersIntoCode)
    },[translatedLayersIntoCode])

    useEffect(()=>{
        setTranslatedLayersIntoCode(magicTranslatorToPython(codeState));
    },[codeState])

    return (
        <div className='node-store-container'>
            <LeftMenu userId={userId} tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className='node-store-content-data'>
                    <div className='node-store-content-up'>
                        <DragArea codeState={codeState} setCodeState={setCodeState} deleteItem={deleteItem} replicateItem={replicateItem}/>
                    </div>
                    <div className='node-store-content-submit'>
                        <DeployArea editorValue={translatedLayersIntoCode}/>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default NodeStore;
