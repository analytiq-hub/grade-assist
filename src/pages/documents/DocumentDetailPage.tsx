import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, CheckSquare, File, Calendar, Tag, Info, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import useDocumentStore from '../../store/documentStore';
import useSchemaStore from '../../store/schemaStore';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { documents, fetchDocuments, gradeDocument } = useDocumentStore();
  const { schemas, fetchSchemas } = useSchemaStore();
  
  const [selectedSchemaId, setSelectedSchemaId] = useState<string>('');
  const [isGrading, setIsGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDocuments();
    fetchSchemas();
  }, [fetchDocuments, fetchSchemas]);
  
  const document = documents.find(doc => doc.id === id);
  
  const handleGradeDocument = async () => {
    if (!id || !selectedSchemaId) {
      setError('Please select a grading schema');
      return;
    }
    
    setError(null);
    setIsGrading(true);
    
    try {
      const result = await gradeDocument(id, selectedSchemaId);
      navigate(`/grading/${result.id}`);
    } catch (err) {
      console.error('Error grading document:', err);
      setError('Failed to start grading process. Please try again.');
    } finally {
      setIsGrading(false);
    }
  };
  
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-6"></div>
        <p className="text-gray-600">Loading document information...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <button 
          onClick={() => navigate('/documents')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Documents
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Document details */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card mb-8">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Document Information</h2>
              <button className="text-gray-600 hover:text-gray-900 p-1">
                <Download size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <FileText size={32} className="text-gray-600" />
                </div>
                
                <div className="flex-grow">
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{document.name}</h1>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <File size={16} className="mr-2" />
                      <span>Type: {document.content_type.split('/')[1].toUpperCase()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>Uploaded: {format(new Date(document.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag size={16} className="mr-2" />
                      <span>Size: {(document.size / 1024).toFixed(2)} KB</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${document.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${document.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${document.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${document.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Document Preview</h2>
            </div>
            
            <div className="p-6">
              <div className="border border-gray-200 rounded-md h-96 flex items-center justify-center">
                {/* In a real app, this would be a PDF viewer or document preview */}
                <div className="text-center p-4">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Document preview not available in this demo</p>
                  <p className="text-sm text-gray-500 mt-2">In a production app, this would show the actual document content</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Grading sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card sticky top-6">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Grade Document</h2>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 mb-4 flex items-start gap-2">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <div className="form-control">
                <label htmlFor="schemaId" className="form-label">Select Grading Schema</label>
                <select
                  id="schemaId"
                  value={selectedSchemaId}
                  onChange={(e) => setSelectedSchemaId(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Select a schema --</option>
                  {schemas.map(schema => (
                    <option key={schema.id} value={schema.id}>
                      {schema.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
                <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  The AI will analyze this document based on your selected grading schema. You'll be able to review and adjust the results.
                </p>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleGradeDocument}
                  disabled={isGrading || !selectedSchemaId}
                  className={`btn btn-primary w-full ${isGrading || !selectedSchemaId ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isGrading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckSquare size={18} />
                      Grade Document
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4">
                <Link 
                  to={schemas.length === 0 ? '/schemas/new' : '/schemas'}
                  className="text-sm text-blue-600 hover:text-blue-800 flex justify-center"
                >
                  {schemas.length === 0 ? 'Create a new schema first' : 'Manage grading schemas'}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;