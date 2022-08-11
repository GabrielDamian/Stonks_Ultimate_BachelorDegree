import React,{useState} from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard";
import IDE from './Pages/IDE';
import NodeStore from './Pages/NodeStore';
import Overview from './Pages/Overview';

function App() {
  
  const [tabs, setTabs] = useState({
    options: ['/','/ide','/drag'],
    selected: '/ide'
  })

  return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/" element={<Dashboard tabIndex={0} tabs={tabs} setTabs={setTabs}/>} />
          <Route exact path="/ide" element={<IDE tabIndex={1} tabs={tabs} setTabs={setTabs}/>}/>
          <Route exact path="/drag" element={<NodeStore tabIndex={2} tabs={tabs} setTabs={setTabs}/>} />
          <Route exact path="/overview" element={<Overview tabIndex={2} tabs={tabs} setTabs={setTabs}/>} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
