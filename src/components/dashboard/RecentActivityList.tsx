import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileText, CheckCircle, Clock, User, FileCheck } from 'lucide-react';

// Mock activity data
const activities = [
  {
    id: 1,
    type: 'upload',
    title: 'Midterm Exams Batch 2',
    description: 'Uploaded 24 documents for grading',
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    icon: <FileText size={16} className="text-blue-600" />,
  },
  {
    id: 2,
    type: 'graded',
    title: 'Quiz #3 - Biology',
    description: 'Completed grading with 85% average score',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    icon: <CheckCircle size={16} className="text-green-600" />,
  },
  {
    id: 3,
    type: 'pending',
    title: 'Final Essays - English 101',
    description: '18 documents waiting for review',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    icon: <Clock size={16} className="text-yellow-600" />,
  },
  {
    id: 4,
    type: 'collaborator',
    title: 'Jane Smith joined',
    description: 'Added as collaborator to your account',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    icon: <User size={16} className="text-purple-600" />,
  },
  {
    id: 5,
    type: 'schema',
    title: 'Physics Lab Report Schema',
    description: 'Created new grading schema',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    icon: <FileCheck size={16} className="text-indigo-600" />,
  },
];

const RecentActivityList: React.FC = () => {
  return (
    <div className="divide-y divide-gray-200">
      {activities.map((activity) => (
        <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
          <div className="flex">
            <div className="mr-4 mt-0.5">
              <div className="p-2 rounded-full bg-gray-100">
                {activity.icon}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="p-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivityList;