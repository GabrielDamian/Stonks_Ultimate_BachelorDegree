import React from 'react';
import './AddBlock.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import CustomMonaco from '../Components/Organisms/CustomMonaco';
import Button from '@mui/material/Button';
import Hyperparameters from '../Components/Molecules/Hyperparameters';

function AddBlock({tabIndex,setTabs,tabs})
{
    const TextAreaStyle={
        width: '100%'
    }
    
    return(
        <div className='add-block-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='add-block-content'>
                <div className="add-block-content-header">
                    <span>Add Data Flow Block Area (ADMIN)</span>
                </div>
                <div className="add-block-content-data">
                    <div className='add-block-content-data-center'>
                        <div className='add-block-content-data-center-inputs'>
                            
                            <div className='add-block-content-data-center-left'>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="Name"
                                        sx={TextAreaStyle}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="Description"
                                        sx={TextAreaStyle}
                                    />
                                </div>
                                <div className='content-data-center-row'>
                                    <TextField
                                        id="outlined-required"
                                        label="Icon link"
                                        sx={TextAreaStyle}
                                    />
                                </div>
                            </div>

                            <div className='add-block-content-data-center-right'>
                                <Hyperparameters />
                            </div>

                        </div>
                      

                        


                        <div className='content-data-center-row' style={{height:'300px', padding:'20px'}}>
                           <CustomMonaco/>
                        </div>
                        <div className='content-data-center-row' style={{
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center'
                        }}>
                            <Button variant="contained">Add Block</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddBlock;