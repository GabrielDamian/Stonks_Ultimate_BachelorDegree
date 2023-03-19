import React from 'react';
import './CustomButton.css';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const BootstrapButton = styled(Button)({
    padding: "10px 20px",
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#131517',
    borderColor: '#bcfe2f',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#a3db29',
      borderColor: '#a3db29',
      boxShadow: 'none',
      color: "#131517"
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#bcfe2f',
      borderColor: '#bcfe2f',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgb(189, 255, 46)',
    },
});

export default function CustomButton({text, onClick})
{
    return(
        <BootstrapButton onClick={onClick} variant="contained" disableRipple>
        {text}
        </BootstrapButton>
    )
}