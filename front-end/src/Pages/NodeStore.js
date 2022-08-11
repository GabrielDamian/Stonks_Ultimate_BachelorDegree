import React,{useState,Component} from 'react';
import './NodeStore.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import {DragDropContext,Draggable,Droppable} from 'react-beautiful-dnd';
import DragArea from '../Components/Organisms/DragArea';
import DragItem from '../Components/Molecules/DragItem';

function NodeStore({tabIndex,setTabs,tabs})
{
    return (
        <div className='node-store-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='node-store-content'>
                <div className='node-store-content-header'>
                    <span>Interactive Diagrams IDE</span>
                </div>
                <div className='node-store-content-data'>
                    <div className='node-store-content-up'>
                        <DragArea/>
                    </div>
                    <div className='node-store-content-submit'>
                        <span>submit area</span>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default NodeStore;
