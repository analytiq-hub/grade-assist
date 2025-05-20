import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FilePlus, FileText, CheckSquare, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import DashboardMetricCard from '../../components/dashboard/DashboardMetricCard';
import RecentActivityList from '../../components/dashboard/RecentActivityList';
import UpcomingTasksList from '../../components/dashboard/UpcomingTasksList';

const DashboardPage: React.FC = () => {
  // Mock data
  const metrics = [
    { 
      title: 'Papers Graded', 
      value: 128, 
      change: 12, 
      icon: <CheckSquare size={20} />,
      color: 'bg-green-100 text-green-700',
    },
    { 
      title: 'Pending Papers', 
      value: 45, 
      change: -5, 
      icon: <Clock size={20} />,
      color: 'bg-yellow-100 text-yellow-700',
    },
    { 
      title: 'Active Schemas', 
      value: 8, 
      change: 2, 
      icon: <FilePlus size={20} />,
      color: 'bg-blue-100 text-blue-700',
    },
    { 
      title: 'Student Average', 
      value: 84, 
      change: 3, 
      icon: <TrendingUp size={20} />,
      color: 'bg-purple-100 text-purple-700',
      suffix: '%',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your grading activities</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Link to="/documents" className="btn btn-primary">
            <FileText size={18} />
            Upload Papers
          </Link>
          <Link to="/schemas" className="btn btn-outline">
            <FilePlus size={18} />
            New Schema
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric, index) => (
          <motion.div key={index} variants={itemVariants}>
            <DashboardMetricCard {...metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Alert banner */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3"
      >
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-900">New DocRouter Integration Available</h3>
          <p className="text-blue-700 mt-1">
            We've updated our DocRouter integration for better reliability and speed. 
            Visit the settings page to ensure your API token is up to date.
          </p>
        </div>
      </motion.div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent activity */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="card">
            <RecentActivityList />
          </div>
        </motion.div>

        {/* Upcoming tasks */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <div className="card">
            <UpcomingTasksList />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;