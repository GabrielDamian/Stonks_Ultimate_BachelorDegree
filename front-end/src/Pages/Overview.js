import React,{useState, useEffect} from 'react';
import './Overview.css';
import LeftMenu from '../Components/Organisms/LeftMenu';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';


export default function Overview({tabIndex,setTabs,tabs})
{
    let testNodes = [
        {
            name:'aa adadad',
            startDate:'45/33/2019',
            creationType:'Jupyter IDE',
            totalPrediction: '400',
            succesRation: '52%',
            market: 'ETH',
            icon:Icon1
        },
        {
            name:'aa2ccd',
            startDate:'35/13/2022',
            creationType:'Data Flow IDE',
            totalPrediction: '100',
            succesRation: '3%',
            market: 'BTC',
            icon:Icon1
        }
    ]
    return (
        <div className='overview-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='overview-content'>
                <div className='overview-content-header'>
                    <span>Overview Panel</span>
                </div>
                <div className='overview-content-data'>
                    <div className='overview-content-data-header'>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">Node Types</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            // value={age}
                            // onChange={handleChange}
                            label="Node Types"
                        >
                            <MenuItem value={10}>Own Nodes</MenuItem>
                            <MenuItem value={20}>Subscribed Nodes</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                    <div className='overview-content-data-selection'>
                        <div className='content-data-selection-list'>
                            {
                                testNodes.map((el)=>{
                                    return(<NodeListElem obj={el}/>)
                                })
                            }
                        </div>
                        <div className='content-data-selection-graph'>
                            <ChartComponent/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function NodeListElem({obj})
{
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

    return(
        <div className="node-list-elem-container">
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
            <div className="node-list-elem-row">
              <span>Delete node:</span>
              <Button variant="contained" sx={{backgroundColor:'red', marginLeft:'20px'}}>Stop Node</Button>
            </div>
          </div>
        </Collapse>
      </List>
        </div>
    )
}