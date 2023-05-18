import React,{useState, useEffect} from 'react';
import './Style/Overview.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import {ChartComponent} from '../Components/Organisms/ChartComponent';
import TopBar from '../Components/Organisms/TopBar';
import {fetchNodeData} from './NodePage';
import OverviewPanel from '../Components/Organisms/OverviewPanel';
import {attachRealData} from './NodePage';
import NodeListElem from '../Components/Organisms/NodeListElem';

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


