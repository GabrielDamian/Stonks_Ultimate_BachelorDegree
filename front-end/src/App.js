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
import MyProfile from './Pages/MyProfile';
import NodePage from './Pages/NodePage';
import Welcome from './Pages/Welcome';

import DashIcon from './Media/Icons/menu/dashboard.png'
import DashIconLight from './Media/Icons/menu/dashboard-light.png'

import DragIconLight from './Media/Icons/menu/drag-and-drop-light.png'
import DragIcon from './Media/Icons/menu/drag-and-drop.png'

import IdeIconLight from './Media/Icons/menu/code-light.png'
import IdeIcon from './Media/Icons/menu/code.png'

import OverviewIconLight from './Media/Icons/menu/view-light.png';
import OverviewIcon from './Media/Icons/menu/view.png';

import CreditIconLight from './Media/Icons/menu/credit-card-light.png';
import CreditIcon from './Media/Icons/menu/credit-card.png';

import AddIconLight from './Media/Icons/menu/add-light.png';
import AddIcon from './Media/Icons/menu/add.png';

import ProfileIconLight from './Media/Icons/menu/user-light.png';
import ProfileIcon from './Media/Icons/menu/user.png';

import NodeIconLight from './Media/Icons/menu/nodes-light.png';
import NodeIcon from './Media/Icons/menu/nodes.png';



import ProtectedRoute from './Pages/PrivateWrapper/ProtectedRoute';
function App() {
  
  let tabs = [
    {
      text: 'Dasboard',
      link: '/dashboard',
      icon: [DashIcon,DashIconLight]
    },
    {
      text: 'Drag',
      link: '/drag',
      icon: [DragIcon,DragIconLight]
    },
    {
      text: 'Ide',
      link: '/ide',
      icon: [IdeIcon,IdeIconLight]
    },
    {
      text: 'Overview',
      link: '/overview',
      icon: [OverviewIcon,OverviewIconLight]
    },
    {
      text: 'Buy Credit',
      link: '/buy-credit',
      icon: [CreditIcon,CreditIconLight]
    },
    {
      text: 'Add Block',
      link: '/add-block',
      icon: [AddIcon,AddIconLight]
    },
    {
      text: 'My Profile',
      link: '/my-profile',
      icon: [ProfileIcon,ProfileIconLight]
    },
    {
      text: 'Node Page',
      link: '/node-page',
      icon: [NodeIcon,NodeIconLight]
    },
  ]

  // ,'/ide','/drag','/overview','/buy-credit','/add-block','/my-profile','/node-page'
  // const [tabs, setTabs] = useState({
  //   options: ['/dashboard','/ide','/drag','/overview','/buy-credit','/add-block','/my-profile','/node-page'],
  //   selected: '/ide'
  // })

  return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/" element={<Welcome/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/signup" element={<Signup/>} />
          
          <Route exact path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard tabIndex={0} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/drag" element={
            <ProtectedRoute>
              <NodeStore tabIndex={1} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/ide" element={
            <ProtectedRoute>
              <IDE tabIndex={2} tabs={tabs} />
            </ProtectedRoute>
          }/>

          

          <Route exact path="/overview" element={
            <ProtectedRoute>
              <Overview tabIndex={3} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/buy-credit" element={
            <ProtectedRoute>
              <AddCredit tabIndex={4} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/add-block" element={
            <ProtectedRoute>
              <AddBlock tabIndex={5} tabs={tabs} />
            </ProtectedRoute>
          }/>
          <Route exact path="/my-profile" element={
            <ProtectedRoute>
              <MyProfile tabIndex={6} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/node-page" element={
            <ProtectedRoute>
              <NodePage tabIndex={7} tabs={tabs}/>
            </ProtectedRoute>
          }/>


      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
