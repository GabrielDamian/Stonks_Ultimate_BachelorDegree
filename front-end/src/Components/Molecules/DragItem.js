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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function DragItem({data, hyperParamsActive})
{
  const [interState, setInternState] = useState({
    layerName: '',
    layerKeyword: '',
    layerDescription: '',
    docLink: '',
    iconLink: '',
    parameters: []
  })
  
  useEffect(()=>{
    if(data !== null && data!==undefined)
    {
      setInternState({...data})
    }
  },[data])

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const extractParameterValues = (magicString)=>{
    let values = []

    let pairs = magicString.split("___")
    pairs.forEach((el)=>{
      let value_split= el.split("--")
      values.push(value_split[1])
    })

    return values
  }
  return (
    <div  className='drag-item-container' >
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <div className="header-item-list">
              <span>{interState.layerName}</span>
              <img src={interState.iconLink} alt="icon"/>
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
            <p>layerKeyword: {interState.layerKeyword}</p><br/>
            <p>layerDescription: {interState.layerDescription}</p><br/>
            <a href={interState.docLink}>docs</a><br/>
            <p>{interState.cevav}</p>
            <p>{interState.cevav}</p>
          </div>
        </Collapse>

        {/* HYPERPARAMETERS */}
        {hyperParamsActive == true?
        <>
          <ListItemButton onClick={handleClick2}>
            <ListItemIcon>
              <DataObjectIcon />
            </ListItemIcon>
            <ListItemText primary="Hyperparameters" />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            <div style={{height:'200px', border:'1px solid red'}}>
              {
                interState.parameters !== undefined ? interState.parameters.map((el)=>{
                  console.log("el ultra deep:",el)
                  return (
                    <div style={{
                      padding: '10px',
                      border:'1px solid blue',
                      width:'100%',
                      minHeight: '50px'
                    }}>
                      <span>{el.paramName} - {el.paramKeyword}</span>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={undefined}
                        label="Age"
                        onChange={()=>{}}
                      >
                        {
                          extractParameterValues(el.parameterValues).map((el_menu_item)=>{
                            return(
                              <MenuItem value={el_menu_item}>{el_menu_item}</MenuItem>
                            )
                          })
                        }
                      </Select>
                    </div>)
                  
                }):null
              }
            </div>
          </Collapse>
        </>
        :null
      }
        
      </List>
    </div>
  );
}
export default DragItem;
