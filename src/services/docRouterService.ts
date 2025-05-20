import axios from 'axios';

// DocRouter API endpoints
const API_BASE_URL = 'https://api.docrouter.ai';

// This would typically come from environment variables
let API_TOKEN = '';

// Set the DocRouter API token
export const setDocRouterToken = (token: string) => {
  API_TOKEN = token;
  localStorage.setItem('docrouter_token', token);
};

// Get the saved DocRouter API token
export const getDocRouterToken = (): string => {
  if (!API_TOKEN) {
    API_TOKEN = localStorage.getItem('docrouter_token') || '';
  }
  return API_TOKEN;
};

// API client with authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getDocRouterToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Type definitions
export interface Document {
  id: string;
  name: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  content_type: string;
  size: number;
}

export interface Schema {
  id: string;
  name: string;
  description: string;
  prompt: string;
  created_at: string;
  updated_at: string;
}

export interface GradingResult {
  id: string;
  document_id: string;
  schema_id: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'completed' | 'failed';
  ai_feedback: any;
  teacher_feedback?: any;
  score?: number;
}

// API functions

// Upload a document to DocRouter
export const uploadDocument = async (file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get all documents
export const getDocuments = async (): Promise<Document[]> => {
  const response = await apiClient.get('/documents');
  return response.data;
};

// Get a specific document
export const getDocument = async (id: string): Promise<Document> => {
  const response = await apiClient.get(`/documents/${id}`);
  return response.data;
};

// Create a grading schema
export const createSchema = async (schema: Omit<Schema, 'id' | 'created_at' | 'updated_at'>): Promise<Schema> => {
  const response = await apiClient.post('/schemas', schema);
  return response.data;
};

// Get all schemas
export const getSchemas = async (): Promise<Schema[]> => {
  const response = await apiClient.get('/schemas');
  return response.data;
};

// Get a specific schema
export const getSchema = async (id: string): Promise<Schema> => {
  const response = await apiClient.get(`/schemas/${id}`);
  return response.data;
};

// Update a schema
export const updateSchema = async (id: string, schema: Partial<Schema>): Promise<Schema> => {
  const response = await apiClient.put(`/schemas/${id}`, schema);
  return response.data;
};

// Grade a document using a schema
export const gradeDocument = async (documentId: string, schemaId: string): Promise<GradingResult> => {
  const response = await apiClient.post('/grading', {
    document_id: documentId,
    schema_id: schemaId,
  });
  return response.data;
};

// Get a specific grading result
export const getGradingResult = async (id: string): Promise<GradingResult> => {
  const response = await apiClient.get(`/grading/${id}`);
  return response.data;
};

// Update teacher feedback for a grading result
export const updateGradingResult = async (
  id: string, 
  update: { teacher_feedback: any; score?: number }
): Promise<GradingResult> => {
  const response = await apiClient.put(`/grading/${id}`, update);
  return response.data;
};

export default {
  setDocRouterToken,
  getDocRouterToken,
  uploadDocument,
  getDocuments,
  getDocument,
  createSchema,
  getSchemas,
  getSchema,
  updateSchema,
  gradeDocument,
  getGradingResult,
  updateGradingResult,
};