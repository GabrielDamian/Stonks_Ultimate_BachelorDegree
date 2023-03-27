import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './PresetIDEValues.css';

export default function PresetIDEValues({presetSelected, presetValues, triggerSetSelected})
{
    const SelectCustomStyle = {
        width: '100%',
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
      }

    const handleChange = (e)=>{
        triggerSetSelected(e.target.value)
    }

    return (
        <div class="presetide-container">
            <div class="presetide-container-title">
                <span>Preset Values </span>
            </div>
            <div class="presetide-container-content">
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={presetSelected}
                label="Age"
                onChange={handleChange}
                sx={{
                    ...SelectCustomStyle,
                    width: '100%',
                    marginRight: '20px',
                    marginTop:'20px'
                }}
            >
                {
                    presetValues.map((el,index)=>{
                        return(
                            <MenuItem value={index}>{el.title}</MenuItem>
                        )
                    })
                }
            </Select>
            </div>
        </div>
    )
}