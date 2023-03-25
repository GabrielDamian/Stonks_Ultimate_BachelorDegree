import React,{useState, useEffect} from 'react';
import './LeftMenu.css';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../../Media/logo.png';
import {collectUserData} from '../../API/apiCore';

export default function LeftMenu({userId, tabIndex,tabs}){

  const [userRole, setUserRole] = useState('normal'); //normal || admin

  useEffect(()=>{
    if(userId !== null && userId !== undefined)
    {
        collectUserData(userId,['role'],setUserRole)
    }
  },[userId])

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
                if(el.roles.includes(userRole.role))
                {
                  return <TabItem text={el.text} link={el.link} selected={decideSelected(el,index)} icon={el.icon}/>
                }
                else
                {
                  return null;
                }
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