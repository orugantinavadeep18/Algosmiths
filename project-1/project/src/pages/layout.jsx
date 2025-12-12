// import { Sidebar } from 'lucide-react'
import React from 'react'
import Loading from '../components/Loading'
// import { dummyUserData } from '../dummyData/dummyData'
import { useState as userstate } from 'react'
import { Outlet, Outlet as outlet } from 'react-router-dom'
import { X, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { dummyUserData } from '../assets/assets'
const layout = () => {
  const user =dummyUserData
  const [sidebarOpen, setSidebarOpen] = userstate(false)
  return user ? (
    <div className='w-full flex h-screen'>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='flex-1 bg-slate-50'>
        <Outlet/>
      </div>
      {
      sidebarOpen ?
      <X className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md 
      shadow w-10 h-10text-gray-600 sm:hidden'onClick={()=> setSidebarOpen (false)}/>
      :
      <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md
       shadow w-10 h-10 text-gray-600 sm:hidden 'onClick={()=> setSidebarOpen(true)}/>
      }
    </div>

  ):(
<Loading/>  )
}

export default layout