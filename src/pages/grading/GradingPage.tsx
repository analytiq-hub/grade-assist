import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ThumbsUp, ThumbsDown, Edit, Save, Printer, AlertCircle, Info, FilePlus } from 'lucide-react';
import useDocumentStore from '../../store/documentStore';

const GradingPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  
  const { gradingResults, getGradingResult, updateGradingFeedback } = useDocumentStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [teacherFeedback, setTeacherFeedback] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [editingScore, setEditingScore] = useState(false);
  
  useEffect(() => {
    const fetchGradingResult = async () => {
      if (!documentId) return;
      
      try {
        setLoading(true);
        const data = await getGradingResult(documentId);
        setResult(data);
        
        // Initialize teacher feedback and score from the result
        if (data.teacher_feedback) {
          setTeacherFeedback(data.teacher_feedback);
        }
        
        if (data.score) {
          setScore(data.score);
        } else if (data.ai_feedback && data.ai_feedback.overall_score) {
          // Use AI score as default if available
          setScore(data.ai_feedback.overall_score);
        }
      } catch (err) {
        console.error('Error fetching grading result:', err);
        setError('Failed to load grading results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGradingResult();
  }, [documentId, getGradingResult]);
  
  const handleSaveFeedback = async () => {
    if (!documentId) return;
    
    setSaving(true);
    try {
      await updateGradingFeedback(documentId, teacherFeedback, score);
      // Show success message or update UI
    } catch (err) {
      console.error('Error saving feedback:', err);
      setError('Failed to save your feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  // Mock AI feedback sections for demo
  const aiFeedbackSections = [
    {
      title: 'Introduction',
      score: 18,
      maxScore: 20,
      feedback: 'The introduction provides a clear explanation of the purpose and hypothesis of the experiment. The background information is well-researched and relevant to the topic. Could use more specific details about the experimental design.',
    },
    {
      title: 'Methods',
      score: 16,
      maxScore: 20,
      feedback: 'The methods section is generally well-organized and includes most key procedures. However, some steps lack specific details that would be needed to replicate the experiment. The materials list is complete and well-presented.',
    },
    {
      title: 'Results',
      score: 27,
      maxScore: 30,
      feedback: 'Excellent presentation of data with appropriate charts and graphs. The results are clearly stated and organized logically. All figures are properly labeled and referenced in the text.',
    },
    {
      title: 'Discussion',
      score: 24,
      maxScore: 30,
      feedback: 'The discussion effectively interprets the results and links them to scientific concepts covered in class. Some of the conclusions could be more strongly supported by the data. The limitations section is thorough and thoughtful.',
    },
  ];
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-6"></div>
        <p className="text-gray-600">Loading grading information...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grading Results</h1>
          <p className="text-gray-600 mt-1">Review and finalize the AI-generated evaluation</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveFeedback}
            disabled={saving}
            className={`btn btn-primary ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? (
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
                Save Changes
              </>
            )}
          </button>
          
          <button onClick={handlePrint} className="btn btn-outline">
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-6 flex items-start gap-2">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main grading content */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Document info */}
          <div className="card mb-8">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Document Information</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Document Name</h3>
                  <p className="mt-1">Biology Lab Report - Plant Growth Experiment</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Student</h3>
                  <p className="mt-1">Jane Smith</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Class</h3>
                  <p className="mt-1">Biology 101</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Submitted</h3>
                  <p className="mt-1">May 15, 2025</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Feedback sections */}
          <div className="space-y-8">
            {aiFeedbackSections.map((section, index) => (
              <motion.div 
                key={index}
                className="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      {section.score}/{section.maxScore}
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(section.score / section.maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">AI Feedback</h3>
                    <div className="p-4 bg-blue-50 rounded-md text-blue-800 text-sm">
                      {section.feedback}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Teacher Notes</h3>
                    <textarea
                      rows={3}
                      className="form-input w-full text-sm"
                      placeholder="Add your own feedback for this section..."
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <button className="btn btn-outline text-sm py-1 px-3">
                      <ThumbsUp size={14} className="mr-1" />
                      Accept AI Feedback
                    </button>
                    <button className="btn btn-outline text-sm py-1 px-3">
                      <FilePlus size={14} className="mr-1" />
                      Add Comment
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Overall teacher feedback */}
          <motion.div 
            className="card mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Overall Teacher Feedback</h2>
            </div>
            
            <div className="p-6">
              <textarea
                rows={6}
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
                className="form-input w-full"
                placeholder="Add your overall feedback for this document..."
              ></textarea>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card sticky top-6">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Grading Summary</h2>
            </div>
            
            <div className="p-6">
              {/* Overall score */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center">
                  <div className="text-4xl font-bold text-blue-600">{score}</div>
                  <div className="text-xl text-gray-500 ml-1">/ 100</div>
                  <button 
                    onClick={() => setEditingScore(!editingScore)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit size={16} />
                  </button>
                </div>
                
                {editingScore && (
                  <div className="mt-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      className="form-input w-20 text-center"
                    />
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mt-2">Final Score</p>
              </div>
              
              {/* Score breakdown */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium text-gray-900">Score Breakdown</h3>
                
                {aiFeedbackSections.map((section, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{section.title}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{section.score}/{section.maxScore}</span>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-medium">85/100</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <button className="btn btn-success w-full">
                  <ThumbsUp size={18} />
                  Approve Grading
                </button>
                
                <button className="btn btn-outline w-full">
                  <ThumbsDown size={18} />
                  Request AI Re-grade
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
                <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  The final grade can be adjusted manually. Once you're satisfied with the evaluation, approve the grading to finalize it.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GradingPage;