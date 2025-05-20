import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Info } from 'lucide-react';
import useRubricStore from '../../store/schemaStore';

const RubricDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewRubric = id === 'new';
  
  const { currentRubric, loading, error, fetchRubric, createNewRubric, updateExistingRubric } = useRubricStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // If editing an existing rubric, fetch it
    if (!isNewRubric && id) {
      fetchRubric(id);
    }
  }, [fetchRubric, id, isNewRubric]);
  
  useEffect(() => {
    // Populate form with current rubric data when available
    if (currentRubric && !isNewRubric) {
      setFormData({
        name: currentRubric.name,
        description: currentRubric.description,
        prompt: currentRubric.prompt,
      });
    }
  }, [currentRubric, isNewRubric]);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Rubric name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.prompt.trim()) {
      errors.prompt = 'Prompt template is required';
    } else if (formData.prompt.length < 50) {
      errors.prompt = 'Prompt should be more detailed (at least 50 characters)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isNewRubric) {
        const newRubric = await createNewRubric(formData);
        navigate(`/rubrics/${newRubric.id}`);
      } else if (id) {
        await updateExistingRubric(id, formData);
      }
    } catch (err) {
      console.error('Error saving rubric:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  if (loading && !isNewRubric) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <button 
          onClick={() => navigate('/rubrics')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Rubrics
        </button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewRubric ? 'Create New Rubric' : `Edit Rubric: ${currentRubric?.name}`}
        </h1>
        <p className="text-gray-600 mt-1">
          {isNewRubric 
            ? 'Define how the AI should evaluate student submissions' 
            : 'Update your grading criteria and instructions'}
        </p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6">
          {error}
        </div>
      )}
      
      <motion.form 
        onSubmit={handleSubmit}
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Rubric Information</h2>
        </div>
        
        <div className="p-6">
          <div className="form-control">
            <label htmlFor="name" className="form-label">Rubric Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${formErrors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="e.g., Biology Lab Report Rubric"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>
          
          <div className="form-control">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`form-input ${formErrors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="A brief description of what this rubric evaluates"
            ></textarea>
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>
          
          <div className="form-control">
            <div className="flex items-center justify-between">
              <label htmlFor="prompt" className="form-label">Prompt Template</label>
              <button 
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Info size={14} className="mr-1" />
                View examples
              </button>
            </div>
            <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-3 text-sm text-blue-800">
              <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p>
                Write detailed instructions for how the AI should evaluate student submissions. Include specific criteria, point distributions, and what to look for.
              </p>
            </div>
            <textarea
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              rows={4}
              className={`form-input ${formErrors.prompt ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="Instructions for the AI on how to grade using this rubric"
            ></textarea>
            {formErrors.prompt && (
              <p className="mt-1 text-sm text-red-600">{formErrors.prompt}</p>
            )}
          </div>
          
          <div className="mt-6">
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
                  {isNewRubric ? 'Create Rubric' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default RubricDetailPage;