import React from 'react';
import { format } from 'date-fns';
import { Clock, Tag } from 'lucide-react';

// Mock upcoming tasks
const tasks = [
  {
    id: 1,
    title: 'Grade Biology Finals',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    priority: 'high',
    count: 32,
  },
  {
    id: 2,
    title: 'Review Math Quizzes',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    priority: 'medium',
    count: 45,
  },
  {
    id: 3,
    title: 'History Essays Batch 2',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: 'medium',
    count: 28,
  },
  {
    id: 4,
    title: 'Chemistry Lab Reports',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // a week from now
    priority: 'low',
    count: 17,
  },
];

// Priority colors
const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const UpcomingTasksList: React.FC = () => {
  return (
    <div className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{task.title}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Clock size={14} className="mr-1" />
            Due {format(task.dueDate, 'MMM d, yyyy')}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Tag size={14} className="mr-1" />
            {task.count} documents
          </div>
        </div>
      ))}
      
      <div className="p-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all tasks
        </button>
      </div>
    </div>
  );
};

export default UpcomingTasksList;