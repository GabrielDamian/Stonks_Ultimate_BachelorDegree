import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import './Pages/Style/Dashboard.css';
import IDE from './Pages/IDE';
import Drag from './Pages/Drag';
import Overview from './Pages/Overview';
import AddBlock from './Pages/AddBlock';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import MyProfile from './Pages/MyProfile';
import NodePage from './Pages/NodePage';
import Welcome from './Pages/Welcome';

import DragIconLight from './Media/Icons/menu/drag-and-drop-light.png'
import DragIcon from './Media/Icons/menu/drag-and-drop.png'

import IdeIconLight from './Media/Icons/menu/code-light.png'
import IdeIcon from './Media/Icons/menu/code.png'

import OverviewIconLight from './Media/Icons/menu/view-light.png';
import OverviewIcon from './Media/Icons/menu/view.png';


import AddIconLight from './Media/Icons/menu/add-light.png';
import AddIcon from './Media/Icons/menu/add.png';

import ProfileIconLight from './Media/Icons/menu/user-light.png';
import ProfileIcon from './Media/Icons/menu/user.png';

import NodeIconLight from './Media/Icons/menu/nodes-light.png';
import NodeIcon from './Media/Icons/menu/nodes.png';

import AdminIcon from './Media/Icons/menu/admin.png';
import AdminIconLight from './Media/Icons/menu/admin-light.png';


import ProtectedRoute from './Pages/PrivateWrapper/ProtectedRoute';
import DeleteBlock from './Pages/Delete Block';
function App() {
  
  let tabs = [
    {
      text: 'Drag',
      link: '/drag',
      icon: [DragIcon,DragIconLight],
      roles: ['user','admin']
    },
    {
      text: 'Ide',
      link: '/ide',
      icon: [IdeIcon,IdeIconLight],
      roles: ['user','admin']
    },
    {
      text: 'Overview',
      link: '/overview',
      icon: [OverviewIcon,OverviewIconLight],
      roles: ['user','admin']
    },
    {
      text: 'Add Block',
      link: '/add-block',
      icon: [AddIcon,AddIconLight],
      roles: ['admin']
    },
    {
      text: 'Admin Area',
      link: '/admin-area',
      icon: [AdminIcon, AdminIconLight],
      roles: ['admin']
    },
    {
      text: 'My Profile',
      link: '/my-profile',
      icon: [ProfileIcon,ProfileIconLight],
      roles: ['user','admin']
    },
    {
      text: 'Node Page',
      link: '/node-page',
      icon: [NodeIcon,NodeIconLight],
      roles: ['user','admin']
    },
  ]

  return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/" element={<Welcome/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/signup" element={<Signup/>} />
          
          <Route exact path="/drag" element={
            <ProtectedRoute>
              <Drag tabIndex={0} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/ide" element={
            <ProtectedRoute>
              <IDE tabIndex={1} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/overview" element={
            <ProtectedRoute>
              <Overview tabIndex={2} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/add-block" element={
            <ProtectedRoute>
              <AddBlock tabIndex={3} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/admin-area" element={
            <ProtectedRoute>
              {/* <AddBlock tabIndex={3} tabs={tabs} /> */}
              <DeleteBlock tabIndex={4} tabs={tabs}/>
            </ProtectedRoute>
          }/>

         
          <Route exact path="/my-profile" element={
            <ProtectedRoute>
              <MyProfile tabIndex={5} tabs={tabs} />
            </ProtectedRoute>
          }/>

          <Route exact path="/node-page" element={
            <ProtectedRoute>
              <NodePage tabIndex={6} tabs={tabs}/>
            </ProtectedRoute>
          }/>

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
