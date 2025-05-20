import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Search, FileCheck, Clock, AlertCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import useDocumentStore from '../../store/documentStore';

const DocumentsPage: React.FC = () => {
  const { documents, loading, error, fetchDocuments, uploadNewDocument } = useDocumentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  // Filter documents based on search term and status filter
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || doc.status === filter;
    return matchesSearch && matchesFilter;
  });
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        setUploadError(null);
        
        try {
          await Promise.all(acceptedFiles.map(file => uploadNewDocument(file)));
        } catch (error) {
          console.error('Upload failed:', error);
          setUploadError('Failed to upload one or more files. Please try again.');
        } finally {
          setIsUploading(false);
        }
      }
    }
  });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Upload and manage student papers</p>
        </div>
      </div>
      
      {/* Upload area */}
      <motion.div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <Upload size={40} className={`mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-gray-700">Uploading documents...</p>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop files here' : 'Drag and drop files here or click to browse'}
              </p>
              <p className="text-gray-500 text-sm">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </>
          )}
        </div>
      </motion.div>
      
      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6 flex items-start gap-2">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p>{uploadError}</p>
        </div>
      )}
      
      {/* Search and filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input w-full pl-10"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="sm:w-64">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select w-full appearance-none pl-10"
            >
              <option value="all">All documents</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Documents list */}
      {loading && !isUploading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6">
          {error}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center my-12">
          <div className="mb-4">
            <FileText size={48} className="mx-auto text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filter !== 'all' ? 'No matching documents found' : 'No documents uploaded yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filter !== 'all' ? 
              'Try changing your search or filter criteria' : 
              'Upload documents to start grading'
            }
          </p>
        </div>
      ) : (
        <motion.div
          className="card overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <FileText size={20} className="text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">{(doc.size / 1024).toFixed(2)} KB</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${doc.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${doc.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${doc.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {doc.status === 'completed' && <FileCheck size={14} className="mr-1" />}
                        {doc.status === 'pending' && <Clock size={14} className="mr-1" />}
                        {doc.status === 'processing' && (
                          <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {doc.status === 'failed' && <AlertCircle size={14} className="mr-1" />}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(doc.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.content_type.split('/')[1].toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/documents/${doc.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentsPage;