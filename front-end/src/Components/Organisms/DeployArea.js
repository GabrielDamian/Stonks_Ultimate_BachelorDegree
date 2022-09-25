import react from 'react';
import './DeployArea.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
                        <div className='ide-deploy-field' style={{flexDirection: 'column'}}>
                            <div className='ide-deploy-field-row'>
                                <span>BTC</span>
                                <Checkbox {...label} />
                            </div>
                            <div className='ide-deploy-field-row'>
                                <span>ETH</span>
                                <Checkbox {...label} />
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

