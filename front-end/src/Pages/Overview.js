import React,{useState, useEffect} from 'react';
import './Style/Overview.css';
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
import TopBar from '../Components/Organisms/TopBar';
import {Link} from 'react-router-dom';
import RedirectIcon from '../Media/Icons/maximize.png';
import {fetchNodeData} from './NodePage';
import OverviewPanel from '../Components/Organisms/OverviewPanel';
import {attachRealData} from './NodePage';

export default function Overview({tabIndex,setTabs,tabs,userId})
{
  const [nodes, setNodes] = useState([]);

  let collectUserNodes = async()=>{
    console.log("fetch nodes")
      try{
        let response =await fetch('http://localhost:3001/fetch-nodes', { 
                method: 'GET', 
                headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Credentials':true
                },
                withCredentials: true,
                credentials: 'include'
            })
            if(!response.ok)
            {
                console.log("err  private route:",response.status)
            }
            else 
            {
                const data = await response.json();
                console.log("Nodes:", data)
                setNodes(data.nodes);
                if(data.nodes.length > 0)
                {
                  setSelected(0);
                }
            }
      }
      catch(err)
      {
          console.log("err:",err)
      }
  }
    useEffect(()=>{
      collectUserNodes() 
    },[])

    useEffect(()=>{
      console.log("nodes update:",nodes)  
    },[nodes])

    // TODO: handle selected node logic 
    const selectedIndex = 0;
    const [selected, setSelected] = useState(undefined);

    const [selectedData, setSelectedData] = useState(undefined);
    const [realData, setRealData] = useState(null);

    useEffect(()=>{
      console.log("selectedData update:", selectedData)
      if(selectedData !== undefined && selectedData.market !== undefined)
      {
          attachRealData(selectedData,setRealData);
      }
    },[selectedData])

    useEffect(()=>{
      if(selected !== undefined)
      {
        let extractSelectedId = nodes[selected].id;
        console.log("to fetch node:", extractSelectedId);
        fetchNodeData(extractSelectedId, setSelectedData);

      }
    },[selected])
    return (
        <div className='overview-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className='overview-content-data'>
                    {/* <div className='overview-content-data-header'>
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
                    </div> */}
                    <div className='overview-content-data-selection'>
                        <div className='content-data-selection-list'>
                            {
                                nodes.map((el, index)=>{
                                    return(<NodeListElem 
                                            obj={el} 
                                            handleClickIndex={()=>{setSelected(index)}}
                                            selected={selected !== undefined ? (selected == index ? true:false):false}/>)
                                            
                                })
                            }
                        </div>
                        <div className='content-data-selection-graph'>
                            <ChartComponent source={selectedData == undefined ? [] :selectedData.predictions} realData={realData}/>
                            <OverviewPanel data={selectedData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function NodeListElem({obj,selected,handleClickIndex})
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
        <div
          onClick={handleClickIndex}
          className="node-list-elem-container"
          style={{
            border: `1px solid ${selected == true ? 'var(--lime)':'var(--border)'}`
          }} 
          >
          <List
            sx={{ 
              width: '100%', 
              backgroundColor: 'var(--dark)',
              border: '1px solid var(--border)'
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              <div className="header-item-list">
                <Link to={`/node-page/?nodeid=${obj.id}`}>
                  <img title='To node page' src={RedirectIcon} style={{height: '20px', objectFit: 'contain'}}/>
                </Link>
                <p>{obj.buildName}</p>
                <p>{obj.status}</p>
              </div>

            </ListSubheader>
          }
        >
          <ListItemButton 
            onClick={handleClick2} 
            sx={{
              backgroundColor: 'var(--border)',
              color: 'var(--font)',
            }}
              >
            <ListItemIcon>
              <MoreHorizIcon sx={{color: 'var(--font)'}}/>
            </ListItemIcon>
            <ListItemText 
              
              primary="More Details" />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            <div className='node-list-elem-rows-container'>
              <div className="node-list-elem-row">
                <div className="node-list-elem-row-name">
                  <span>ceva</span>
                </div>
                <div className="node-list-elem-row-value">
                  <span>ceva</span>
                </div>
              </div>
            </div>
          </Collapse>
        </List>
        </div>
    )
}