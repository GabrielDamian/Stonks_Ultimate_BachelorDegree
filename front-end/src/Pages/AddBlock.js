import React from 'react';
import './Style/AddBlock.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import CustomMonaco from '../Components/Organisms/CustomMonaco';
import Button from '@mui/material/Button';
import Hyperparameters from '../Components/Molecules/Hyperparameters';
import TopBar from '../Components/Organisms/TopBar';

function AddBlock({tabIndex,setTabs,tabs,userId})
{
    const TextAreaStyle={
        width: '100%'
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