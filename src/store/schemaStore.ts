import { create } from 'zustand';
import { Schema, getSchemas, createSchema, getSchema, updateSchema } from '../services/docRouterService';

interface SchemaState {
  schemas: Schema[];
  currentSchema: Schema | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSchemas: () => Promise<void>;
  fetchSchema: (id: string) => Promise<Schema>;
  createNewSchema: (data: Omit<Schema, 'id' | 'created_at' | 'updated_at'>) => Promise<Schema>;
  updateExistingSchema: (id: string, data: Partial<Schema>) => Promise<Schema>;
}

const useSchemaStore = create<SchemaState>((set, get) => ({
  schemas: [],
  currentSchema: null,
  loading: false,
  error: null,
  
  fetchSchemas: async () => {
    set({ loading: true, error: null });
    try {
      const schemas = await getSchemas();
      set({ schemas, loading: false });
    } catch (error) {
      console.error('Error fetching schemas:', error);
      set({ error: 'Failed to load schemas', loading: false });
    }
  },
  
  fetchSchema: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const schema = await getSchema(id);
      set({ currentSchema: schema, loading: false });
      return schema;
    } catch (error) {
      console.error('Error fetching schema:', error);
      set({ error: 'Failed to load schema', loading: false });
      throw error;
    }
  },
  
  createNewSchema: async (data) => {
    set({ loading: true, error: null });
    try {
      const newSchema = await createSchema(data);
      set((state) => ({ 
        schemas: [...state.schemas, newSchema],
        loading: false 
      }));
      return newSchema;
    } catch (error) {
      console.error('Error creating schema:', error);
      set({ error: 'Failed to create schema', loading: false });
      throw error;
    }
  },
  
  updateExistingSchema: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedSchema = await updateSchema(id, data);
      set((state) => ({ 
        schemas: state.schemas.map(schema => schema.id === id ? updatedSchema : schema),
        currentSchema: updatedSchema,
        loading: false 
      }));
      return updatedSchema;
    } catch (error) {
      console.error('Error updating schema:', error);
      set({ error: 'Failed to update schema', loading: false });
      throw error;
    }
  },
}));

export default useSchemaStore;