import React,{useState, useEffect} from 'react';
import './Style/Overview.css';
import LeftMenu from '../Components/Organisms/LeftMenu';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {ChartComponent} from '../Components/Organisms/ChartComponent';
import TopBar from '../Components/Organisms/TopBar';
import {Link} from 'react-router-dom';
import RedirectIcon from '../Media/Icons/maximize.png';
import {fetchNodeData} from './NodePage';
import OverviewPanel from '../Components/Organisms/OverviewPanel';
import {attachRealData} from './NodePage';
import SuccessIcon from '../Media/Icons/check.png';
import FailureIcon from '../Media/Icons/error.png';
import LoadingIcon from '../Media/loading.gif';

export default function Overview({tabIndex,setTabs,tabs,userId})
{
  const [nodes, setNodes] = useState([]);

  let collectUserNodes = async()=>{
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
                console.error("Overview:",response.status )
            }
            else 
            {
                const data = await response.json();
                setNodes(data.nodes);
                if(data.nodes.length > 0)
                {
                  setSelected(0);
                }
            }
      }
      catch(err)
      {
        console.error("Overview:", err)
      }
  }
    useEffect(()=>{
      collectUserNodes() 
    },[])


    const [selected, setSelected] = useState(undefined);

    const [selectedData, setSelectedData] = useState(undefined);
    const [realData, setRealData] = useState(null);

    useEffect(()=>{
      if(selectedData !== undefined && selectedData.market !== undefined)
      {
          attachRealData(selectedData,setRealData);
      }
    },[selectedData])

    useEffect(()=>{
      if(selected !== undefined)
      {
        let extractSelectedId = nodes[selected].id;
        fetchNodeData(extractSelectedId, setSelectedData);

      }
    },[selected])
    return (
        <div className='overview-container'>
            <LeftMenu userId={userId} tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar userId={userId}/>
                <div className='overview-content-data'>
                    {
                      nodes.length === 0 ?
                      <div
                        style={{
                          backgroundColor: 'var(--dark)',
                          height:'100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}                                
                      >
                        <p style={{color: 'white', fontSize: '1.5rem'}}>Please create a node first.</p>
                      </div>
                      :
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
                    }
                    
                </div>
            </div>
        </div>
    )
}


function NodeListElem({obj,selected,handleClickIndex})
{

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const [nodeMetadata, setNodemetadata] = useState(undefined);
  
  useEffect(()=>{
    let metadataConcat = obj.status
    let dataObj = metadataConcat.split(",")
    
    let finalParent = {}
    dataObj.forEach((el)=>{
      let splitLocal = el.split(":")
      finalParent[splitLocal[0]] = splitLocal[1]
    })

    console.log("finalParent:",finalParent)
    setNodemetadata(finalParent)
  },[obj] )

  let decideIcon = (statusParam)=>{

    if(statusParam == undefined) return null

    let imgStyleObj = {
      height: '20px',
      objectFit: 'contained',
      marginLeft: '10px'
    }
    let parentStyleDiv = {
        padding: '5px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }

    if(statusParam.trim() == "Success")
    {
      return (
        <div style={parentStyleDiv}>
        <span>Status: Success</span><img src={SuccessIcon} style={imgStyleObj}/>
        </div>
      )
    }
      else if (statusParam.trim() === 'Failure')
      {
      return (
        <div style={parentStyleDiv}>
        <span>Status: Failed</span><img src={FailureIcon} style={imgStyleObj}/>
        </div>
      )
    }
    else if(statusParam.trim() === 'InProgress')
    {
      return (
        <div style={parentStyleDiv}>
        <span>Status: Deploy in progress</span><img src={LoadingIcon} style={imgStyleObj}/>
        </div>
      )
    }
    else 
    {
      return 'Unknown'
    }
  }
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
              border: '1px solid var(--border)',
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
                <p>{nodeMetadata !== undefined ? (
                  decideIcon(nodeMetadata['Status'])
                ) :null}</p>
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
                  <span>Status:</span>
                </div>
                <div className="node-list-elem-row-value">
                  <span>{nodeMetadata !== undefined ? nodeMetadata['Status'] : null}</span>
                </div>
              </div>
              <div className="node-list-elem-row">
                <div className="node-list-elem-row-name">
                  <span>Message:</span>
                </div>
                <div className="node-list-elem-row-value">
                  <span>{nodeMetadata !== undefined ? nodeMetadata[' Message'] : null} </span>
                </div>
              </div>
              <div className="node-list-elem-row">
                <div className="node-list-elem-row-name">
                  <span>Date</span>
                </div>
                <div className="node-list-elem-row-value">
                  <span>{nodeMetadata !== undefined ? nodeMetadata[' Date']: null}</span>
                </div>
              </div>
            </div>
          </Collapse>
        </List>
        </div>
    )
}