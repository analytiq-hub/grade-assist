import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { setAuthToken, testDocRouterConnection } from '../../services/openapi-client';
import {
  getDocRouterToken,
  setDocRouterToken,
  getDocRouterOrgId,
  setDocRouterOrgId,
  getDocRouterApiBaseUrl,
  setDocRouterApiBaseUrl,
} from '../../services/docRouterService';

const SettingsPage: React.FC = () => {
  const envApiToken = import.meta.env.VITE_DOCROUTER_API_TOKEN as string | undefined;
  const envOrgId = import.meta.env.VITE_DOCROUTER_ORG_ID as string | undefined;
  const envApiBaseUrl = import.meta.env.VITE_DOCROUTER_API_BASE_URL as string | undefined;

  const [apiToken, setApiToken] = useState('');
  const [orgId, setOrgId] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [showTokenError, setShowTokenError] = useState(false);
  const [showOrgIdError, setShowOrgIdError] = useState(false);
  const [showApiBaseUrlError, setShowApiBaseUrlError] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Prefer localStorage, fallback to .env
    const storedToken = getDocRouterToken();
    setApiToken(storedToken || envApiToken || '');
    const storedOrgId = getDocRouterOrgId();
    setOrgId(storedOrgId || envOrgId || '');
    const storedApiBaseUrl = getDocRouterApiBaseUrl();
    setApiBaseUrl(storedApiBaseUrl || envApiBaseUrl || '');
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!apiToken.trim()) {
      setShowTokenError(true);
      hasError = true;
    } else {
      setShowTokenError(false);
    }
    if (!orgId.trim()) {
      setShowOrgIdError(true);
      hasError = true;
    } else {
      setShowOrgIdError(false);
    }
    if (!apiBaseUrl.trim()) {
      setShowApiBaseUrlError(true);
      hasError = true;
    } else {
      setShowApiBaseUrlError(false);
    }
    if (hasError) return;
    try {
      setDocRouterToken(apiToken);
      setDocRouterOrgId(orgId);
      setDocRouterApiBaseUrl(apiBaseUrl);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setAuthToken(apiToken);
    setDocRouterApiBaseUrl(apiBaseUrl);
    setDocRouterOrgId(orgId);
    const ok = await testDocRouterConnection(orgId);
    setTestResult(ok ? 'success' : 'error');
    setIsTesting(false);
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
                    You'll need to provide a DocRouter API token, organization ID, and API URL to use the grading features. 
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
              
              <form onSubmit={handleSaveSettings}>
                <div className="form-control mb-4">
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
                <div className="form-control mb-4">
                  <label htmlFor="orgId" className="form-label">Organization ID</label>
                  <input
                    id="orgId"
                    type="text"
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className={`form-input ${showOrgIdError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="Your DocRouter Organization ID"
                  />
                  {showOrgIdError && (
                    <p className="mt-1 text-sm text-red-600">Please enter a valid Organization ID</p>
                  )}
                </div>
                <div className="form-control mb-4">
                  <label htmlFor="apiBaseUrl" className="form-label">DocRouter FastAPI URL</label>
                  <input
                    id="apiBaseUrl"
                    type="text"
                    value={apiBaseUrl}
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                    className={`form-input ${showApiBaseUrlError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="https://app.docrouter.ai/fastapi"
                  />
                  {showApiBaseUrlError && (
                    <p className="mt-1 text-sm text-red-600">Please enter a valid API URL</p>
                  )}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className={`btn btn-secondary ${isTesting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isTesting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Testing...
                      </>
                    ) : (
                      <>Test DocRouter Connection</>
                    )}
                  </button>
                  {testResult === 'success' && (
                    <span className="text-green-600 text-sm">Connection successful!</span>
                  )}
                  {testResult === 'error' && (
                    <span className="text-red-600 text-sm">Connection failed. Check your settings.</span>
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