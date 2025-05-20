import { create } from 'zustand';
import { Rubric, getRubrics, createRubric, getRubric, updateRubric } from '../services/docRouterService';

interface RubricState {
  rubrics: Rubric[];
  currentRubric: Rubric | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRubrics: () => Promise<void>;
  fetchRubric: (id: string) => Promise<Rubric>;
  createNewRubric: (data: Omit<Rubric, 'id' | 'created_at' | 'updated_at'>) => Promise<Rubric>;
  updateExistingRubric: (id: string, data: Partial<Rubric>) => Promise<Rubric>;
}

const useRubricStore = create<RubricState>((set, get) => ({
  rubrics: [],
  currentRubric: null,
  loading: false,
  error: null,
  
  fetchRubrics: async () => {
    set({ loading: true, error: null });
    try {
      const rubrics = await getRubrics();
      set({ rubrics, loading: false });
    } catch (error) {
      console.error('Error fetching rubrics:', error);
      set({ error: 'Failed to load rubrics', loading: false });
    }
  },
  
  fetchRubric: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const rubric = await getRubric(id);
      set({ currentRubric: rubric, loading: false });
      return rubric;
    } catch (error) {
      console.error('Error fetching rubric:', error);
      set({ error: 'Failed to load rubric', loading: false });
      throw error;
    }
  },
  
  createNewRubric: async (data) => {
    set({ loading: true, error: null });
    try {
      const newRubric = await createRubric(data);
      set((state) => ({ 
        rubrics: [...state.rubrics, newRubric],
        loading: false 
      }));
      return newRubric;
    } catch (error) {
      console.error('Error creating rubric:', error);
      set({ error: 'Failed to create rubric', loading: false });
      throw error;
    }
  },
  
  updateExistingRubric: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedRubric = await updateRubric(id, data);
      set((state) => ({ 
        rubrics: state.rubrics.map(rubric => rubric.id === id ? updatedRubric : rubric),
        currentRubric: updatedRubric,
        loading: false 
      }));
      return updatedRubric;
    } catch (error) {
      console.error('Error updating rubric:', error);
      set({ error: 'Failed to update rubric', loading: false });
      throw error;
    }
  },
}));

export default useRubricStore;