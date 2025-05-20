import axios from 'axios';

// DocRouter API endpoints
const API_BASE_URL = 'https://app.docrouter.ai/fastapi';

// Get API token from environment variable (Vite convention: VITE_DOCROUTER_API_TOKEN)
// Fallback to localStorage for runtime overrides (e.g., user input in settings)
const ENV_API_TOKEN = import.meta.env.VITE_DOCROUTER_API_TOKEN as string | undefined;

// Get organization ID from environment variable (Vite convention: VITE_DOCROUTER_ORG_ID)
// Fallback to localStorage for runtime overrides
const ENV_ORG_ID = import.meta.env.VITE_DOCROUTER_ORG_ID as string | undefined;

// Set the DocRouter API token (overrides env, persists in localStorage)
export const setDocRouterToken = (token: string) => {
  localStorage.setItem('docrouter_token', token);
};

// Get the saved DocRouter API token, preferring env variable if set
export const getDocRouterToken = (): string => {
  if (ENV_API_TOKEN && ENV_API_TOKEN.length > 0) {
    return ENV_API_TOKEN;
  }
  return localStorage.getItem('docrouter_token') || '';
};

// Set organization ID (overrides env, persists in localStorage)
export const setDocRouterOrgId = (orgId: string) => {
  localStorage.setItem('docrouter_org_id', orgId);
};

// Get organization ID from env or localStorage
export const getDocRouterOrgId = (): string => {
  if (ENV_ORG_ID && ENV_ORG_ID.length > 0) {
    return ENV_ORG_ID;
  }
  return localStorage.getItem('docrouter_org_id') || '';
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

// Get all documents (requires orgId)
export const getDocuments = async (organizationId: string): Promise<Document[]> => {
  const response = await apiClient.get(`/v0/orgs/${organizationId}/documents`);
  return response.data.documents;
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

// Test the DocRouter API connection and token/org validity
export const testDocRouterConnection = async (): Promise<boolean> => {
  try {
    const orgId = getDocRouterOrgId();
    if (!orgId) throw new Error('No organization ID set');
    await getDocuments(orgId);
    return true;
  } catch (error) {
    console.error('DocRouter connection test failed:', error);
    return false;
  }
};

export default {
  setDocRouterToken,
  getDocRouterToken,
  setDocRouterOrgId,
  getDocRouterOrgId,
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
  testDocRouterConnection,
};