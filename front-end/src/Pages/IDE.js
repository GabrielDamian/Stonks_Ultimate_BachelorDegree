import React,{useState,useEffect} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './IDE.css';
import MonacoEditor from 'react-monaco-editor'
import CustomMonaco from '../Components/Organisms/CustomMonaco';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DocsSection from '../Components/Organisms/DocsSection';


const code =
`
// Define Typescript Interface Employee
interface Employee {
    firstName: String;
    lastName: String;
    contractor?: Boolean;
}
// Use Typescript Interface Employee. 
// This should show you an error on john 
// as required attribute lastName is missing
const john:Employee = {
    firstName:"John",
    // lastName:"Smith"
    // contractor:true
}
`
export default function IDE({tabIndex,setTabs,tabs})
{
    console.log("tabs idex:", tabIndex)

    const [value, setValue] = useState(code)

    const handleChange = (newValue)=>{
        setValue(newValue);
    }
    
    return (
        <div className='ide-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='ide-content'>
                <div className='ide-header'>
                    <span>IDE Builder</span>
                </div>
                <div className='ide-core'>
                    <div className='ide-core-docs'>
                        <DocsSection/>
                    </div>
                    <div className='ide-core-editor'>
                        <CustomMonaco/>
                    </div>
                </div>
                <div className='ide-deploy'>
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
                                    width:'70%'
                                }}    
                            />
                        </div>
                        <div className='ide-deploy-field'>
                            <TextField 
                                id="outlined-basic" 
                                label="Description" 
                                variant="outlined" 
                                sx={{
                                    width:'70%'
                                }}    
                            />
                        </div>
                        <div className='ide-deploy-action'>
                            <Button variant="contained">Deploy</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}