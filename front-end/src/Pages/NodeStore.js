import React,{useState,Component} from 'react';
import './Style/NodeStore.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import {DragDropContext,Draggable,Droppable} from 'react-beautiful-dnd';
import DragArea from '../Components/Organisms/DragArea';
import DragItem from '../Components/Molecules/DragItem';
import DeployArea from '../Components/Organisms/DeployArea';
import TopBar from '../Components/Organisms/TopBar';

function NodeStore({tabIndex,setTabs,tabs,userId})
{
    let [codeState, setCodeState] = useState('');

    React.useEffect(()=>{
        console.log("codeState update:",codeState)
    },[codeState])

    return (
        <div className='node-store-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className='node-store-content-data'>
                    <div className='node-store-content-up'>
                        <DragArea codeState={codeState} setCodeState={setCodeState}/>
                    </div>
                    <div className='node-store-content-submit'>
                        <DeployArea editorValue={codeState}/>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default NodeStore;
