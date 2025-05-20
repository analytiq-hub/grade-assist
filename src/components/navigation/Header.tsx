import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/rubrics')) {
      if (path.includes('/rubrics/')) return 'Rubric Details';
      return 'Grading Rubrics';
    }
    if (path.includes('/documents')) {
      if (path.includes('/documents/')) return 'Document Details';
      return 'Documents';
    }
    if (path.includes('/grading')) return 'Grading';
    if (path.includes('/collaborators')) return 'Collaborators';
    if (path.includes('/settings')) return 'Settings';
    return 'GradeAssist';
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64"
          />
          <Search size={18} className="absolute left-3 text-gray-400" />
        </div>
        
        {/* Notifications */}
        <button className="p-1.5 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
        
        {/* User menu */}
        <div className="relative">
          <button 
            className="flex items-center gap-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="w-full h-full p-1" />
              )}
            </div>
            <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
          </button>
          
          <AnimatePresence>
            {showUserMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;