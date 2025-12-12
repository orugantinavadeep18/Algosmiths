import React, { useState, useEffect } from 'react'
import {Route , Routes} from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import Feed from './pages/Feed'
import Feeds from './pages/Feeds'
import Message from './pages/Message'
import Connection from './pages/Connection'
import Discover from './pages/Discover'
import DiscoveryMap from './pages/DiscoveryMap'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import PostTask from './pages/PostTask'
import AcceptTask from './pages/AcceptTask'
import ReviewApplications from './pages/ReviewApplications'
import Home from './pages/home'
import Layout from './pages/layout'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
   <>
     <Navbar />
     <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/admin-dashboard' element={<ProtectedRoute requireAdmin={true}><AdminDashboard/></ProtectedRoute>} />
        <Route path='feeds' element={<ProtectedRoute><Feeds/></ProtectedRoute>}/>
        <Route path='accept-task' element={<ProtectedRoute><AcceptTask/></ProtectedRoute>}/>
        <Route path='post-task' element={<ProtectedRoute><PostTask/></ProtectedRoute>}/>
        <Route path='review-applications' element={<ProtectedRoute><ReviewApplications/></ProtectedRoute>}/>
        <Route path='messages' element={<ProtectedRoute><Message/></ProtectedRoute>} />
        <Route path='messages/:userid' element={<ProtectedRoute><Message/></ProtectedRoute>} />
        <Route path='connections' element={<ProtectedRoute><Connection/></ProtectedRoute>}/>
        <Route path='discover' element={<ProtectedRoute><Discover/></ProtectedRoute>} />
        <Route path='discovery-map' element={<ProtectedRoute><DiscoveryMap/></ProtectedRoute>} />
        <Route path='profile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path='profile/:profileId' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path='create-post' element={<ProtectedRoute><CreatePost/></ProtectedRoute>}/>
     </Routes>
    </>
  )
}

export default App