import React from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import './MarketPlace.css';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Icon1 from '../Media/Icons/artificial-intelligence.png';
import {ChartComponent} from '../Components/Organisms/ChartComponent';
import Button from '@mui/material/Button';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function MarketPalce({tabIndex,setTabs,tabs})
{
    let testList = [
        {
            name: 'node_1',
            details: 'asdad2d 43f3 3 d 2 d  wsdqwd2 d 2',
            ratio: '55%',
            uptime: '45 days',
            totalTrades: '234',
            icon: Icon1
        },
        {
            name: 'node_1',
            details: 'asdad2d 43f3 3 d 2 d  wsdqwd2 d 2',
            ratio: '55%',
            uptime: '45 days',
            totalTrades: '234',
            icon: Icon1
        }
    ]
    return(
        <div className='marketplace-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='marketplace-content'>
                <div className='marketplace-content-header'>
                    <span>Marketplace </span>
                </div>
                <div className='marketplace-content-data'>
                    <div className='marketplace-content-filters'>
                        <div className='marketplace-content-filters-title'>
                            <span>Filters</span>
                        </div> 
                        <div className='marketplace-content-filters-content'>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120, marginRight:'40px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Min Ration:</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={age}
                                // onChange={handleChange}
                                label="Node Types"
                            >
                                <MenuItem value={10}>48%</MenuItem>
                                <MenuItem value={20}>49%</MenuItem>
                                <MenuItem value={20}>50%</MenuItem>
                                <MenuItem value={20}>51%</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">Source mode</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={age}
                                // onChange={handleChange}
                                label="Node Types"
                            >
                                <MenuItem value={10}>IDE</MenuItem>
                                <MenuItem value={20}>Diagrams</MenuItem>
                            </Select>
                        </FormControl>
                        </div> 
                    </div> 
                    <div className='marketplace-content-list'>
                    {
                        testList.map((el)=>{
                            return <MarketItem obj={el}/>
                        })
                    }
                    </div> 
                </div>    
            </div>
        </div>
    )
}
export default MarketPalce;

const MarketItem = ({obj})=>{
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

    return(
        <div className='marketplace-item'>
        <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                <div className="header-item-list">
                    <span>{obj.name}</span>
                    <img src={obj.icon} alt="icon"/>
                </div>

                </ListSubheader>
            }
            >
            {/* NODE DETAILS */}
            <ListItemButton onClick={handleClick2}>
                <ListItemIcon>
                <MoreHorizIcon />
                </ListItemIcon>
                <ListItemText primary="More Details" />
                {open2 ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open2} timeout="auto" unmountOnExit>
                <div style={{height:'200px', border:'1px solid red'}}>
                </div>
            </Collapse>
        </List>
        <div className='marketplace-item-subscribe'>
            <Button variant="contained">Subscribe to node</Button>
        </div>
        </div>
    )
}