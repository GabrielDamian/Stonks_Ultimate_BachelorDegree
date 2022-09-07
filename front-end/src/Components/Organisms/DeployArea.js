import react from 'react';
import './DeployArea.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

function DeployArea ()
{
    return(
        <div className='deployment-area-container'>

            <div className='ide-deploy-header'>
                        <span>Deployment Area:</span>
                    </div>
                    <div className='ide-deploy-content'>
                        <div className='ide-deploy-field'>
                            <TextField 
                                id="outlined-basic" 
                                label="Name" 
                                variant="outlined" 
                                sx={{
                                    width:'100%'
                                }}    
                            />
                        </div>
                        <div className='ide-deploy-field'>
                            <TextField 
                                id="outlined-basic" 
                                label="Description" 
                                variant="outlined" 
                                sx={{
                                    width:'100%'
                                }}    
                            />
                        </div>
                        <div className='ide-deploy-field'>
                            <TextField 
                                id="outlined-basic" 
                                label="Price ($)" 
                                variant="outlined" 
                                sx={{
                                    width:'100%'
                                }}   
                                type="number" 
                            />
                        </div>
                        <div className='ide-deploy-field' style={{flexDirection: 'column'}}>
                            
                            <div className='ide-deploy-field-price-top'>
                                <span>Open to marketplace:</span>
                            </div>
                            <div className='ide-deploy-field-price-bot'>
                                <Switch />
                            </div>
                        </div>
                        <div className='ide-deploy-action'>
                            <Button variant="contained">Deploy</Button>
                        </div>
                    </div>
        </div>
    )
}
export default DeployArea;

