import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function TabItem({text, link, selected, icon}){
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