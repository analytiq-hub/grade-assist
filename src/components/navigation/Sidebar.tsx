import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  FileText, 
  CheckSquare, 
  Users, 
  Settings, 
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/rubrics', icon: <FilePlus size={20} />, label: 'Rubrics' },
    { path: '/documents', icon: <FileText size={20} />, label: 'Papers' },
    { path: '/grading', icon: <CheckSquare size={20} />, label: 'Grading' },
    { path: '/collaborators', icon: <Users size={20} />, label: 'Collaborators' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <motion.div 
      className={`bg-white border-r border-gray-200 h-screen flex-shrink-0 transition-all duration-300 flex flex-col relative ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      layout
    >
      {/* Logo */}
      <div className={`p-4 border-b border-gray-200 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-600" size={collapsed ? 28 : 24} />
          {!collapsed && <span className="font-semibold text-lg">GradeAssist</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200
                  ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white rounded-full p-1 border border-gray-200 shadow-sm"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.div>
  );
};

export default Sidebar;