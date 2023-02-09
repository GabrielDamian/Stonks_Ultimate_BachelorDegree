import React,{useState,Component, useEffect} from 'react';
import {DragDropContext,Draggable,Droppable} from 'react-beautiful-dnd';
import './DragArea.css';
import DragItem from '../Molecules/DragItem';

const menu = {
    width: '35px',
    height: '5px',
    backgroundColor: 'black',
    margin: '6px 0',
    border:'1px solid red'
};
// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

function DragArea() {


    const [state, setState] = useState({
        items: [],
        selected: []
    });

    useEffect(()=>{
        fetchLayers();
    },[])

    const fetchLayers = async ()=>{
        console.log("fetchLayers:")
        try{
            let response = await fetch('http://localhost:3001/fetch-layers', { 
                    method: 'GET', 
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
                   
                    setState((prev)=>{
                        let copy = {...prev}
                        copy.items = [...data.layers]
                        return copy
                    })
                }
        }
        catch(err)
        {
            console.log("err:",err)
        }
    }
    const id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    const getList = id => state[id2List[id]];

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            setState(state);
        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            setState({
                items: result.droppable,
                selected: result.droppable2
            });
        }
    };



        return (
            <div className='drag-area-container'>
                <DragDropContext onDragEnd={onDragEnd}>
                <div className='drag-area-info-panel'>
                    <div className='drag-area-info-panel-header'>
                        <span>Library Section</span>
                    </div>
                    <div className='drag-area-data'>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                className="drag-area-info-panel-drag"
                                // style={getListStyle(snapshot.isDraggingOver)}
                                >
                                {state.items.length > 0 &&
                                    state.items.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={String(item._id)}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                
                                                <div style={{border:'1px solid red'}}>
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <DragItem data={item}/>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    </div>
                </div>
               
                <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className="drag-area-info-panel-drag"
                            // style={getListStyle(snapshot.isDraggingOver)}
                            >
                            {state.selected.map((item, index) => (
                                 <Draggable
                                 key={item.id}
                                 draggableId={item.id}
                                 index={index}>
                                 {(provided, snapshot) => (
                                     
                                     <div style={{
                                        border:'1px solid red', 
                                        margin:'20px',
                                        }}>
                                         <div
                                             ref={provided.innerRef}
                                             {...provided.draggableProps}
                                             {...provided.dragHandleProps}
                                             style={getItemStyle(
                                                 snapshot.isDragging,
                                                 provided.draggableProps.style
                                             )}
                                            // style={{
                                            //     width:'100%',
                                            //     border:'1px solid red'
                                            // }}
                                             >
                                              <DragItem name={item.content}/>
                                         </div>
                                     </div>
                                 )}
                             </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            </div>
        );
}

export default DragArea;
