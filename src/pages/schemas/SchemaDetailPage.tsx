import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Info } from 'lucide-react';
import useSchemaStore from '../../store/schemaStore';

const SchemaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewSchema = id === 'new';
  
  const { currentSchema, loading, error, fetchSchema, createNewSchema, updateExistingSchema } = useSchemaStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // If editing an existing schema, fetch it
    if (!isNewSchema && id) {
      fetchSchema(id);
    }
  }, [fetchSchema, id, isNewSchema]);
  
  useEffect(() => {
    // Populate form with current schema data when available
    if (currentSchema && !isNewSchema) {
      setFormData({
        name: currentSchema.name,
        description: currentSchema.description,
        prompt: currentSchema.prompt,
      });
    }
  }, [currentSchema, isNewSchema]);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Schema name is required';
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
      if (isNewSchema) {
        const newSchema = await createNewSchema(formData);
        navigate(`/schemas/${newSchema.id}`);
      } else if (id) {
        await updateExistingSchema(id, formData);
      }
    } catch (err) {
      console.error('Error saving schema:', err);
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
  
  if (loading && !isNewSchema) {
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
          onClick={() => navigate('/schemas')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Schemas
        </button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewSchema ? 'Create New Schema' : `Edit Schema: ${currentSchema?.name}`}
        </h1>
        <p className="text-gray-600 mt-1">
          {isNewSchema 
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
          <h2 className="text-lg font-semibold">Schema Information</h2>
        </div>
        
        <div className="p-6">
          <div className="form-control">
            <label htmlFor="name" className="form-label">Schema Name</label>
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
              placeholder="A brief description of what this schema evaluates"
            ></textarea>
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>
          
          <div className="form-control">
            <div className="flex items-center justify-between">
              <label htmlFor="prompt" className="form-label">Grading Instructions (Prompt)</label>
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
              rows={10}
              className={`form-input font-mono text-sm ${formErrors.prompt ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="You are an expert grader for a biology lab report. Grade this report based on the following criteria:
1. Introduction (20 points): Clear explanation of purpose and hypothesis
2. Methods (20 points): Clearly described procedures that could be replicated
3. Results (30 points): Well-organized data with appropriate charts/graphs
4. Discussion (30 points): Thoughtful analysis linking results to scientific concepts

For each section, provide specific feedback on strengths and areas for improvement. Include an overall score out of 100 points."
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
                  {isNewSchema ? 'Create Schema' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default SchemaDetailPage;