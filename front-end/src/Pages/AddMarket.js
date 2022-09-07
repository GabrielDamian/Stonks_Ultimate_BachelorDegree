import React from 'react';
import './AddMarket.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }


function AddMarket({tabIndex,setTabs,tabs}){

    const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

    return(
        <div className='add-market-container'>
            <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='add-market-content'>
            <div className="add-market-content-header">
                    <span>Add market Area (ADMIN)</span>
                </div>
                <div className="add-market-content-data">
                <Box sx={{ width: '100%', border: '3px solid green',height:'100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Edit old" {...a11yProps(0)} />
                        <Tab label="Add new" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <div className="add-market-content-data-old">
                            <div className="add-market-content-data-old-content-selector">
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value='ETH'
                                label="Age"
                                // onChange={handleChange}
                                >
                                <MenuItem value={10}>ETH</MenuItem>
                                <MenuItem value={20}>BTC</MenuItem>
                                <MenuItem value={30}>LUNA</MenuItem>
                            </Select>
                            </div>
                            <div className="add-market-content-data-old-content-editor">
                                <div className="add-market-content-data-old-content-editor-fields">
                                    <TextField id="outlined-basic" label="Name" variant="outlined" />
                                    <TextField id="outlined-basic" label="Price" variant="outlined" />
                                    <TextField id="outlined-basic" label="ceva" variant="outlined" />
                                </div>
                                <div className="add-market-content-data-old-content-editor-action">
                                    <Button variant="contained" disabled>SAVE</Button>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                    <div className="add-market-content-data-new">
                        <div className="add-market-content-data-new-fields">
                            <TextField id="outlined-basic" label="Name" variant="outlined" />
                            <TextField id="outlined-basic" label="Price" variant="outlined" />
                            <TextField id="outlined-basic" label="Description" variant="outlined" />
                            <TextField id="outlined-basic" label="API" variant="outlined" />
                        </div>
                        <div className="add-market-content-data-new-action">
                            <Button variant="contained">ADD MARKET</Button>
                        </div>
                    </div>
                    </TabPanel>
                  
                </Box>
                </div>
            </div>
        </div>
    )
}
export default AddMarket;
