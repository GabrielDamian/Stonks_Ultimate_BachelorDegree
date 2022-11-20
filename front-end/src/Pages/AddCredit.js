import React from 'react';
import './Style/AddCredit.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TopBar from '../Components/Organisms/TopBar';

function AddCredit({tabIndex,setTabs,tabs,userId}){
    return(
        <div className='add-credit-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
           
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className="add-credit-content-data">
                <div className="add-credit-content-data-center">
                    <div className="add-credit-content-data-center-input">
                        <TextField id="outlined-basic" label="Amount $" variant="outlined" />
                    </div>
                    <div className="add-credit-content-data-center-buttons">
                        <div className="add-credit-content-data-center-buttons-center">
                            <Button variant="contained">Paypal</Button>
                            <Button variant="contained">Revolut</Button>
                            <Button variant="contained">Bank Transfer</Button>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            
        </div>
    )
}
export default AddCredit;
