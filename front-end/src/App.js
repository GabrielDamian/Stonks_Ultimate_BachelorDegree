import React,{useState} from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard";
import IDE from './Pages/IDE';
import NodeStore from './Pages/NodeStore';
import Overview from './Pages/Overview';
import AddBlock from './Pages/AddBlock';
import MarketPalce from './Pages/MarketPlace';

function App() {
  
  const [tabs, setTabs] = useState({
    options: ['/','/ide','/drag','/add-block','/overview','/market-place'],
    selected: '/ide'
  })

  return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/" element={<Dashboard tabIndex={0} tabs={tabs} setTabs={setTabs}/>} />
          <Route exact path="/ide" element={<IDE tabIndex={1} tabs={tabs} setTabs={setTabs}/>}/>
          <Route exact path="/drag" element={<NodeStore tabIndex={2} tabs={tabs} setTabs={setTabs}/>} />
          <Route exact path="/add-block" element={<AddBlock tabIndex={3} tabs={tabs} setTabs={setTabs}/>} />
          <Route exact path="/overview" element={<Overview tabIndex={4} tabs={tabs} setTabs={setTabs}/>} />
          <Route exact path="/market-place" element={<MarketPalce tabIndex={5} tabs={tabs} setTabs={setTabs}/>} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
