import React,{useState,useEffect} from 'react';
import './LeftMenu.css';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { tabsListUnstyledClasses } from '@mui/base';
import LogoIcon from '../../Media/logo.png';

export default function LeftMenu({tabIndex,tabs}){
  

  const decideSelected = (el,index)=>{
    return el.text == tabs[tabIndex].text
  }
  return(
      <div className='left-bar-container'>
          <div className='left-bar-header'>
              <a href="/">
                <img src={LogoIcon}/>
              </a>
          </div>
          <div className='left-bar-items'>
            {
              tabs.map((el, index)=>{
                return <TabItem text={el.text} link={el.link} selected={decideSelected(el,index)} icon={el.icon}/>
              })
            }
          </div>
      </div>
  )
}

const TabItem = ({text, link, selected, icon})=>{
  const navigate = useNavigate();
  return(
    <div className={`left-bar-items-el ${selected == true ? 'left-bar-items-el-active ':'left-bar-items-el-inactive '}`} onClick={()=>navigate(link)}>
      <div className="left-bar-items-el-inner">
        <img src={selected == true ? icon[0] : icon[1]}/>
        <span >{text}</span>
      </div>
    </div>
  )
}