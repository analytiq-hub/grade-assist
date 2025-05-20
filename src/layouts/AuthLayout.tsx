import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-white flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <BookOpen size={32} />
            <h1 className="text-2xl font-bold">GradeAssist</h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6">Intelligent grading, thoughtful feedback</h2>
            <p className="text-lg opacity-90 mb-8">
              Let AI handle the initial assessment while you focus on what matters most: providing personalized guidance to your students.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p>Save hours on repetitive grading tasks</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p>Ensure consistent evaluation across all submissions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p>Collaborate seamlessly with teaching assistants</p>
              </div>
            </div>
          </motion.div>
        </div>
        <p className="text-sm opacity-70">© 2025 GradeAssist. All rights reserved.</p>
      </div>

      {/* Right side - auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;