import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDocRouterToken, setDocRouterToken } from '../../services/docRouterService';

const SettingsPage: React.FC = () => {
  const [apiToken, setApiToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTokenError, setShowTokenError] = useState(false);

  useEffect(() => {
    // Load the saved token
    const savedToken = getDocRouterToken();
    if (savedToken) {
      setApiToken(savedToken);
    }
  }, []);

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!apiToken.trim()) {
      setShowTokenError(true);
      return;
    }
    
    setShowTokenError(false);
    setIsSaving(true);
    
    try {
      // In a real app, you would validate the token here
      // For this demo, we'll just save it
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API call
      
      setDocRouterToken(apiToken);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving token:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* API Configuration */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">DocRouter API Configuration</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800">
                    You'll need to provide a DocRouter API token to use the grading features. 
                    <a 
                      href="https://github.com/analytiq-hub/doc-router" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-600 hover:text-blue-800 underline"
                    >
                      Learn more about DocRouter
                    </a>
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSaveToken}>
                <div className="form-control">
                  <label htmlFor="apiToken" className="form-label">DocRouter API Token</label>
                  <input
                    id="apiToken"
                    type="text"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    className={`form-input ${showTokenError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="Your DocRouter API token"
                  />
                  {showTokenError && (
                    <p className="mt-1 text-sm text-red-600">Please enter a valid API token</p>
                  )}
                </div>
                
                <div className="mt-6 flex items-center">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`btn btn-primary ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save API Token
                      </>
                    )}
                  </button>
                  
                  {showSuccess && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-4 text-sm text-green-600"
                    >
                      API token saved successfully
                    </motion.p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* Notification Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about grading results</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Collaborator Invitations</h3>
                    <p className="text-sm text-gray-600">Receive notifications about new collaborators</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Document Processing Updates</h3>
                    <p className="text-sm text-gray-600">Get notified when AI has finished processing</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <button className="btn btn-outline mt-6">
                Save Preferences
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Right side: Quick Help */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold">Quick Help</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Setting Up DocRouter</h3>
                <p className="text-sm text-gray-600 mb-3">
                  To integrate with DocRouter, you'll need to create an account and generate an API token from their platform.
                </p>
                <a 
                  href="https://github.com/analytiq-hub/doc-router" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View DocRouter documentation →
                </a>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Creating Effective Schemas</h3>
                <p className="text-sm text-gray-600 mb-3">
                  A good grading schema helps the AI understand exactly what to look for in student papers.
                </p>
                <a 
                  href="#" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Schema best practices →
                </a>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Collaborating with Others</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Invite teaching assistants and other educators to help with the grading process.
                </p>
                <a 
                  href="#" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Collaboration guide →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;