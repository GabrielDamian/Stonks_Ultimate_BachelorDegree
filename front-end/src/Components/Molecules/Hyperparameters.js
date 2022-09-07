import React from 'react';
import './Hyperparameters.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const tempHyper = [
    {
        name: 'Hyper 1',
        desc: 'rem Ipsum is simply dummy text of the printing and typesetting indust'
    },
    {
        name: 'Hyper 2',
        desc: 'rem Ipsu34r34  f dsdfsdf se printing and typesetting indust'
    },
    {
        name: 'Hyper 3',
        desc: 'rem Ipsum is simply dummy text of the printing and typesetting indust'
    },
]
function Hyperparameters(){
    return (
        <div className='hyper-container'>
            <div className='hyper-container-generator'>
                <div className='hyper-container-generator-inputs'>
                    <div className='hyper-container-generator-inputs-row'>
                        <TextField
                            id="outlined-required"
                            label="New Hyperparameter"
                            sx={{width: '100%'}}
                        />
                    </div>
                    <div className='hyper-container-generator-inputs-row'>
                        <TextField
                            id="outlined-required"
                            label="New Hyperparameter"
                            sx={{width: '100%'}}
                        />
                    </div>
                </div>
                <div className='hyper-container-generator-btn'>
                    <Button variant="contained">Add</Button>
                </div>
                {/* <TextField
                    id="outlined-required"
                    label="New Hyperparameter"
                    sx={{width: '70%'}}
                />
                <Button variant="contained">Add</Button> */}
            </div>
            <div className='hyper-container-items'>
                {
                    tempHyper.map((el)=>{
                        return(
                            <div className='hyper-container-items-el'>
                                <div className='hyper-container-items-el-title'>
                                    <span>{el.name}</span>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                                <div className='hyper-container-items-el-desc'>
                                    <span>{el.desc}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Hyperparameters