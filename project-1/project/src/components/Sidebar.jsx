import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Menu from './Menu'
import { CirclePlus, LogOut } from 'lucide-react'

const Sidebar = ({sidebarOpen , setSidebarOpen}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col
    justify-between items-centre max-sm:absolute top-0 bottom-0 z-20 
    $ {sidebarOpen ? 'translate-x-0': 'max-sm:-translate-x-full'}
    transition-all duration-300 ease-in-out`}>
       <div className='w-full'>
        <img onClick={()=>navigate('/')} src={assets.logo} alt='Logo' className='w-40 ml-7 my-2 cursor-pointer'/>
        <hr className='border-gray-300 mb-8'/>
        <Menu setSidebarOpen={setSidebarOpen}/>
        <Link 
  to='/create-post' 
  className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'
> 
  <CirclePlus className='w-5 h-5'/>
  Create Post
</Link>

       </div>
       
       <div className='w-full pb-6 px-6'>
        <button
          onClick={handleLogout}
          className='w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 active:scale-95 transition text-white font-semibold cursor-pointer'
        >
          <LogOut className='w-5 h-5' />
          Logout
        </button>
       </div>
    </div>
  )
}

export default Sidebar