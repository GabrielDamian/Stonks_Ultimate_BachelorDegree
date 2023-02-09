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
{
    let temp =  Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));
    console.log("Temp:", temp)
    return temp
}

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


class DragArea extends Component {

    state = {
        items: getItems(5),
        selected: []
    };

    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };


    handleParameterValueChange = (paramId, newValue) =>{
        console.log("new assigment:", paramId, newValue);

        this.setState((prev)=>{
            
            let selectedLocal = [...prev.selected]
            console.log("locals:",selectedLocal)

            let selectedLocalUpdated = []

            selectedLocal.forEach((el_layer)=>{

                let copy_el_layer = {...el_layer}
                //el - each parameter
                
                let localParameters = [...el_layer.parameters];
                console.log("local parameters:",localParameters)

                let localParametersUpdated = []
                
                localParameters.forEach((el_param)=>{
                    console.log("el param:",el_param)

                    let copy_el_param = {...el_param}

                    console.log("to compare:", el_param._id, paramId)
                    
                    if(el_param._id == paramId)
                    {
                        console.log("COMPARE OK1111111")
                        copy_el_param.selectedValue = newValue
                    }
                    console.log("copy_el_param updatred:",copy_el_param)

                    localParametersUpdated.push(copy_el_param)
                })
                copy_el_layer.parameters = [...localParametersUpdated]
              
                selectedLocalUpdated.push(copy_el_layer)
            })

            let state_copy = {...prev}
            state_copy.selected = selectedLocalUpdated

            console.log("State copy:",state_copy)
            return state_copy
        })
    }


    
    componentDidMount()
    {
        fetch('http://localhost:3001/fetch-layers', { 
            method: 'GET', 
            headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Credentials':true
            },
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data=>{

            let attachId = []
            data.layers.forEach((el)=>{
                let temp = {...el}
                temp.id = el._id

                delete temp._id

                let parametersLocal = temp.parameters;
                let addedSelectedValuField = []
                
                parametersLocal.forEach((parameterEl)=>{
                    let tempParameter = {...parameterEl}
                    tempParameter.selectedValue = undefined
                    addedSelectedValuField.push(tempParameter)
                })
    
                temp.parameters = [...addedSelectedValuField]

                console.log("temp final:",temp)

                attachId.push(temp)
            })

            this.setState((prev)=>{
                let copy = {...prev}
                copy.items = [...attachId]
                return copy
            })
        })
    }

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
        }
    };


    render() {
        return (
            <div className='drag-area-container'>
                <DragDropContext onDragEnd={this.onDragEnd}>
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
                                {this.state.items.length > 0 &&
                                    this.state.items.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
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
                                                        <DragItem 
                                                        handleParameterValueChange={()=>{}}
                                                        data={item} hyperParamsActive={false}/>
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
                            {this.state.selected.map((item, index) => (
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
                                              <DragItem 
                                                handleParameterValueChange={this.handleParameterValueChange}
                                                data={item} 
                                                hyperParamsActive={true}
                                            />
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
}

export default DragArea;
