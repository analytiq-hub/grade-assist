import { create } from 'zustand';
import { Document, GradingResult, getDocuments, uploadDocument, gradeDocument, getGradingResult, updateGradingResult } from '../services/docRouterService';

interface DocumentState {
  documents: Document[];
  gradingResults: Record<string, GradingResult>;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchDocuments: () => Promise<void>;
  uploadNewDocument: (file: File) => Promise<Document>;
  gradeDocument: (documentId: string, rubricId: string) => Promise<GradingResult>;
  getGradingResult: (id: string) => Promise<GradingResult>;
  updateGradingFeedback: (id: string, teacherFeedback: any, score?: number) => Promise<GradingResult>;
}

const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  gradingResults: {},
  loading: false,
  error: null,
  
  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const documents = await getDocuments();
      set({ documents, loading: false });
    } catch (error) {
      console.error('Error fetching documents:', error);
      set({ error: 'Failed to load documents', loading: false });
    }
  },
  
  uploadNewDocument: async (file: File) => {
    set({ loading: true, error: null });
    try {
      const newDocument = await uploadDocument(file);
      set((state) => ({ 
        documents: [...state.documents, newDocument],
        loading: false 
      }));
      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      set({ error: 'Failed to upload document', loading: false });
      throw error;
    }
  },
  
  gradeDocument: async (documentId: string, rubricId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await gradeDocument(documentId, rubricId);
      set((state) => ({ 
        gradingResults: { ...state.gradingResults, [result.id]: result },
        loading: false 
      }));
      return result;
    } catch (error) {
      console.error('Error grading document:', error);
      set({ error: 'Failed to grade document', loading: false });
      throw error;
    }
  },
  
  getGradingResult: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const result = await getGradingResult(id);
      set((state) => ({ 
        gradingResults: { ...state.gradingResults, [id]: result },
        loading: false 
      }));
      return result;
    } catch (error) {
      console.error('Error fetching grading result:', error);
      set({ error: 'Failed to load grading result', loading: false });
      throw error;
    }
  },
  
  updateGradingFeedback: async (id: string, teacherFeedback: any, score?: number) => {
    set({ loading: true, error: null });
    try {
      const result = await updateGradingResult(id, { teacher_feedback: teacherFeedback, score });
      set((state) => ({ 
        gradingResults: { ...state.gradingResults, [id]: result },
        loading: false 
      }));
      return result;
    } catch (error) {
      console.error('Error updating grading feedback:', error);
      set({ error: 'Failed to update feedback', loading: false });
      throw error;
    }
  },
}));

export default useDocumentStore;