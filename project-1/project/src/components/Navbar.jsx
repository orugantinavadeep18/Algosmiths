import React, { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const allLinks = [
    { name: "Home", path: "/" },
    { name: "Post Task", path: "/post-task" },
    { name: "Accept Task", path: "/accept-task" },
    { name: "Feeds", path: "/feeds" },
    { name: "Maps", path: "/discovery-map" },
    { name: "Profile", path: "/profile" },
  ];

  const protectedPages = ["/post-task", "/accept-task", "/feeds", "/profile", "/discovery-map"];

  // Always show all links
  const links = allLinks;

  const handleNavigation = (path) => {
    setIsOpen(false);
    
    if (protectedPages.includes(path) && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-6 pb-6">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between relative h-20">
          
          {/* Left - Logo & Title */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <img 
              src={logoImg} 
              alt="TaskFlow Logo" 
              className="h-12 w-auto group-hover:scale-105 transition-transform"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              TaskFlow
            </h1>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md rounded-3xl px-8 py-3 shadow-2xl shadow-black/30 border border-white/20">
            {links.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(link.path)}
                className="text-black hover:text-gray-700 font-semibold text-lg transition-all duration-200 px-6 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-900 flex-shrink-0"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>

          {/* Right - Auth Button */}
          <div className="hidden md:flex items-center flex-shrink-0">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl shadow-black/30 border border-white/20">
            <div className="flex flex-col space-y-3">
              {links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.path)}
                  className="text-black hover:text-gray-700 font-semibold text-lg py-2 transition-all duration-200 text-left"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-3 border-t border-white/20">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
