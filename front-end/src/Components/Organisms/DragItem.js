import React,{useState, useEffect} from 'react';
import './DragItem.css';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import DataObjectIcon from '@mui/icons-material/DataObject';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DocumentsIcon from '../../Media/Icons/document.png';
import DeleteIcon from '../../Media/Icons/remove.png';

function DragItem({layerIndex, data, hyperParamsActive,handleParameterValueChange, deleteIcon, deleteCallback})
{
  useEffect(()=>{
    console.log("layerIndex:",layerIndex)
  },[layerIndex])

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
  const handleParameterValueChangeLocal = (e)=>{
    handleParameterValueChange(e.target.name, e.target.value, layerIndex);
  }

  return (
    <div  className='drag-item-container'>
      <List
        sx={{ width: '100%', backgroundColor: '#252728', color: '#b0afb2' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <div className="header-item-list">
              <span style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                {
                  deleteIcon == true 
                  ?
                  <img title="Delete Layer" src={DeleteIcon} style={{}} onClick={deleteCallback}/>
                  :
                  null
                }
                {interState.layerName}
              </span>
              <img src={interState.iconLink} alt="icon"/>
            </div>

          </ListSubheader>
        }
      >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <InfoIcon sx={{color: '#bcfe2f'}}/>
          </ListItemIcon>
          <ListItemText primary="About" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <div style={{
            height:'auto', 
            padding: '10px 15px',
            fontSize: '0.8rem'
            }}>
            <p>{interState.layerDescription}</p><br/>

            <div 
              style={{
                width:'100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
              >
                <a title="Visit Documentation" href={interState.docLink}>
                  <img src={DocumentsIcon} style={{
                  height: '20px',
                  objectFit: 'contain'
                }}/>
                </a>
            </div>
          </div>
        </Collapse>

        {hyperParamsActive == true?
        <>
          <ListItemButton onClick={handleClick2}>
            <ListItemIcon>
              <DataObjectIcon sx={{color: '#bcfe2f'}}/>
            </ListItemIcon>
            <ListItemText primary="Hyperparameters" />
            {open2 ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open2} timeout="auto" unmountOnExit>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}>
              {
                interState.parameters !== undefined ? interState.parameters.map((el)=>{
                  return (
                    <div style={{
                      padding: '10px 30px',
                      width:'25%',
                      display:'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span>{el.paramName}</span>
                      <Select
                        labelId="demo-simple-select-label"
                        value={el.selectedValue}
                        label="Age"
                        name={el._id}
                        onChange={handleParameterValueChangeLocal}
                        sx={{
                          color: "white",
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(228, 219, 233, 0.25)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(228, 219, 233, 0.25)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(228, 219, 233, 0.25)',
                          },
                          '.MuiSvgIcon-root ': {
                            fill: "white !important",
                          }
                        }}
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
