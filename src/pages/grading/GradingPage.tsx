import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, Search, FileEdit, Trash2, MoreHorizontal } from 'lucide-react';

// TODO: Replace with useGradeStore when implemented
const mockGrades = [
  {
    id: '1',
    student: 'Alice Smith',
    assignment: 'Essay 1',
    score: 92,
    feedback: 'Excellent work!',
    updated_at: '2024-06-01T12:00:00Z',
  },
  {
    id: '2',
    student: 'Bob Johnson',
    assignment: 'Essay 1',
    score: 85,
    feedback: 'Good analysis, but missing citations.',
    updated_at: '2024-06-02T09:30:00Z',
  },
];

const GradingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter grades based on search term
  const filteredGrades = mockGrades.filter(grade =>
    grade.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.assignment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">View and manage student grades</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/grading/new" className="btn btn-primary">
            <FilePlus size={18} />
            New Grade
          </Link>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search grades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input w-full pl-10"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Grades list */}
      {filteredGrades.length === 0 ? (
        <div className="text-center my-12">
          <div className="mb-4">
            <FilePlus size={48} className="mx-auto text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No grades match your search criteria' : 'Add your first grade to get started'}
          </p>
          <Link to="/grading/new" className="btn btn-primary inline-flex">
            <FilePlus size={18} />
            Add Grade
          </Link>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredGrades.map((grade) => (
            <GradeCard key={grade.id} grade={grade} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

interface GradeCardProps {
  grade: {
    id: string;
    student: string;
    assignment: string;
    score: number;
    feedback: string;
    updated_at: string;
  };
}

const GradeCard: React.FC<GradeCardProps> = ({ grade }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <motion.div 
      className="card h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{grade.student}</h3>
            <div className="text-sm text-gray-600 mb-2">{grade.assignment}</div>
          </div>
          <div className="relative">
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreHorizontal size={18} />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-10">
                <Link 
                  to={`/grading/${grade.id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileEdit size={16} className="mr-2" />
                  Edit Grade
                </Link>
                <button className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <Trash2 size={16} className="mr-2" />
                  Delete Grade
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-blue-700 font-bold text-xl mb-2">Score: {grade.score}</div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{grade.feedback}</p>
        <div className="text-xs text-gray-500">
          Last updated: {new Date(grade.updated_at).toLocaleDateString()}
        </div>
      </div>
      <div className="border-t border-gray-200 p-4">
        <Link 
          to={`/grading/${grade.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default GradingPage;

export {}; 