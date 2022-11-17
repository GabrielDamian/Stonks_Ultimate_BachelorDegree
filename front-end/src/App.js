import React,{useState} from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard";
import IDE from './Pages/IDE';
import NodeStore from './Pages/NodeStore';
import Overview from './Pages/Overview';
import AddBlock from './Pages/AddBlock';
import BuyMarkets from './Pages/Buy Markets';
import AddMarket from './Pages/AddMarket';
import AddCredit from './Pages/AddCredit';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import PrivateRoute from './Pages/PrivateRoute';

import ProtectedRoute from './Pages/PrivateWrapper/ProtectedRoute';
function App() {
  
  const [tabs, setTabs] = useState({
    options: ['/','/ide','/drag','/overview','/buy-credit','/add-block'],
    selected: '/ide'
  })

  return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/signup" element={<Signup/>} />
          
          <Route exact path="/" element={
            <ProtectedRoute>
              <Dashboard tabIndex={0} tabs={tabs} setTabs={setTabs}/>
            </ProtectedRoute>
          }/>

          <Route exact path="/ide" element={
            <ProtectedRoute>
              <IDE tabIndex={1} tabs={tabs} setTabs={setTabs}/>
            </ProtectedRoute>
          }/>

          <Route exact path="/drag" element={
            <ProtectedRoute>
              <NodeStore tabIndex={2} tabs={tabs} setTabs={setTabs}/>
            </ProtectedRoute>
          }/>

          <Route exact path="/overview" element={
            <ProtectedRoute>
              <Overview tabIndex={3} tabs={tabs} setTabs={setTabs}/>
            </ProtectedRoute>
          }/>

          <Route exact path="/buy-credit" element={
            <ProtectedRoute>
              <AddCredit tabIndex={4} tabs={tabs} setTabs={setTabs}/>
            </ProtectedRoute>
          }/>

          <Route exact path="/add-block" element={
            <ProtectedRoute>
              <AddBlock tabIndex={5} tabs={tabs} setTabs={setTabs}/>
            </ProtectedRoute>
          }/>

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
