import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, X, CheckCircle, AlertCircle, User, Users, Shield } from 'lucide-react';

// Mock data for collaborators
const mockCollaborators = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=john',
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'editor',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    lastActive: '5 days ago',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    role: 'viewer',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    lastActive: '2 weeks ago',
  }
];

// Pending invitations
const mockInvitations = [
  {
    id: '1',
    email: 'robert.brown@example.com',
    role: 'editor',
    sentAt: '2 days ago',
  },
  {
    id: '2',
    email: 'sarah.williams@example.com',
    role: 'viewer',
    sentAt: 'Just now',
  }
];

const CollaboratorsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [showSuccess, setShowSuccess] = useState(false);
  const [collaborators, setCollaborators] = useState(mockCollaborators);
  const [invitations, setInvitations] = useState(mockInvitations);
  
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add to invitations
    setInvitations([
      ...invitations,
      {
        id: Date.now().toString(),
        email,
        role,
        sentAt: 'Just now',
      }
    ]);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    setEmail('');
  };
  
  const handleCancelInvitation = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
  };
  
  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(collab => collab.id !== id));
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Collaborators</h1>
        <p className="text-gray-600 mt-1">Manage who has access to your grading projects</p>
      </div>
      
      {/* Invite collaborator form */}
      <motion.div 
        className="card mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Invite Collaborators</h2>
        </div>
        
        <div className="p-6">
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start gap-2"
            >
              <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p>Invitation sent successfully!</p>
            </motion.div>
          )}
          
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10 block w-full"
                  placeholder="Email address"
                  required
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <label htmlFor="role" className="sr-only">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select block w-full"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary whitespace-nowrap"
            >
              <UserPlus size={18} />
              Send Invite
            </button>
          </form>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Admin:</strong> Can invite users, change settings, and grade documents
            </p>
            <p>
              <strong>Editor:</strong> Can grade documents and view all results
            </p>
            <p>
              <strong>Viewer:</strong> Can only view grading results
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Pending invitations */}
      {invitations.length > 0 && (
        <motion.div 
          className="card mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold">Pending Invitations</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invitations.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{invitation.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${invitation.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                        ${invitation.role === 'editor' ? 'bg-blue-100 text-blue-800' : ''}
                        ${invitation.role === 'viewer' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invitation.sentAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      
      {/* Current collaborators */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Current Collaborators</h2>
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {collaborators.length} users
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collaborators.map((collaborator) => (
                <tr key={collaborator.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {collaborator.avatar ? (
                          <img
                            src={collaborator.avatar}
                            alt={collaborator.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={20} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{collaborator.name}</div>
                        <div className="text-sm text-gray-500">{collaborator.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`p-1 mr-2 rounded-full
                        ${collaborator.role === 'admin' ? 'bg-purple-100 text-purple-600' : ''}
                        ${collaborator.role === 'editor' ? 'bg-blue-100 text-blue-600' : ''}
                        ${collaborator.role === 'viewer' ? 'bg-green-100 text-green-600' : ''}
                      `}>
                        {collaborator.role === 'admin' && <Shield size={16} />}
                        {collaborator.role === 'editor' && <Users size={16} />}
                        {collaborator.role === 'viewer' && <User size={16} />}
                      </span>
                      <span className="text-sm text-gray-900">
                        {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {collaborator.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {collaborator.role !== 'admin' && (
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Access explanation */}
      <motion.div 
        className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-900">About Collaborator Access</h3>
          <p className="text-blue-800 mt-1">
            Collaborators can access your grading projects based on their role permissions. 
            To change a collaborator's role, remove them and send a new invitation with the desired role.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CollaboratorsPage;