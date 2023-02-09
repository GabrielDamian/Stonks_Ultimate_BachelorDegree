import React,{useState, useEffect} from 'react';
import './DragItem.css';
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
import DataObjectIcon from '@mui/icons-material/DataObject';
import Icon1 from '../../Media/Icons/artificial-intelligence.png';

function DragItem({data})
{
  useEffect(()=>{
    console.log("data item:",data)
  },[data])

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  return (
    <div  className='drag-item-container' >
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <div className="header-item-list">
              <span>ceva</span>
              <img src={Icon1} alt="icon"/>
            </div>

          </ListSubheader>
        }
      >
        {/* ABOUT */}
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <div style={{height:'200px', border:'1px solid red'}}>
          </div>
        </Collapse>

        {/* HYPERPARAMETERS */}
        <ListItemButton onClick={handleClick2}>
          <ListItemIcon>
            <DataObjectIcon />
          </ListItemIcon>
          <ListItemText primary="Hyperparameters" />
          {open2 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open2} timeout="auto" unmountOnExit>
          <div style={{height:'200px', border:'1px solid red'}}>
          </div>
        </Collapse>
      </List>
    </div>
  );
}
export default DragItem;
