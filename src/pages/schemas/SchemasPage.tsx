import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, Search, FileEdit, Trash2, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import useSchemaStore from '../../store/schemaStore';

const SchemasPage: React.FC = () => {
  const { schemas, loading, error, fetchSchemas } = useSchemaStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchSchemas();
  }, [fetchSchemas]);
  
  // Filter schemas based on search term
  const filteredSchemas = schemas.filter(schema => 
    schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schema.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grading Schemas</h1>
          <p className="text-gray-600 mt-1">Create and manage your grading rubrics</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link to="/schemas/new" className="btn btn-primary">
            <FilePlus size={18} />
            New Schema
          </Link>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search schemas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input w-full pl-10"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Schemas list */}
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6">
          {error}
        </div>
      ) : filteredSchemas.length === 0 ? (
        <div className="text-center my-12">
          <div className="mb-4">
            <FilePlus size={48} className="mx-auto text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schemas found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No schemas match your search criteria' : 'Create your first grading schema to get started'}
          </p>
          <Link to="/schemas/new" className="btn btn-primary inline-flex">
            <FilePlus size={18} />
            Create Schema
          </Link>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredSchemas.map((schema) => (
            <SchemaCard key={schema.id} schema={schema} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

interface SchemaCardProps {
  schema: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
}

const SchemaCard: React.FC<SchemaCardProps> = ({ schema }) => {
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{schema.name}</h3>
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
                  to={`/schemas/${schema.id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileEdit size={16} className="mr-2" />
                  Edit Schema
                </Link>
                <button className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <Trash2 size={16} className="mr-2" />
                  Delete Schema
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{schema.description}</p>
        
        <div className="text-xs text-gray-500">
          Last updated: {format(new Date(schema.updated_at), 'MMM d, yyyy')}
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <Link 
          to={`/schemas/${schema.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default SchemasPage;