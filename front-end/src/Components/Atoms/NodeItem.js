import React from 'react';
import Popover from '@mui/material/Popover';
import NodeIcon from '../../Media/Icons/node.png';
import { useNavigate} from 'react-router-dom';

export default function NodeItem ({data}){
    
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handlePopoverClose = () => {
    setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const handleRedirect = ()=>{
        navigate(`/node-page/?nodeid=${data.id}`)
    }
    return(
        <>
            <div 
                onClick={handleRedirect}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className='my-profile-content-card-nodes-items-el'
                style={{
                    border: `2px solid #${Math.floor(Math.random()*16777215).toString(16)}`
                }}
                
                >
                    <img src={NodeIcon}></img>
            </div>
            <Popover
                id="mouse-over-popover"
                sx={{
                pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <div className='my-profile-content-card-nodes-items-el-pop'>
                    <p>Buil name: {data.buildName}</p>
                    <p>Status: {data.status}</p>
                </div>
            </Popover>
        </>
        
    )
}