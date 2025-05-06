import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '@/utils/config';
import { getAuthHeaders } from '@/stores/auth';

export interface Generation {
  id: number;
  originalImageUrl: string;
  cartoonImageUrl: string;
  createdAt: string;
}

interface GenerationState {
  generations: Generation[];
  isLoading: boolean;
  isGeneratingInBackground: boolean;
  error: string | null;
  generateImage: (imageUrl: string, variant: string) => Promise<void>;
  fetchGenerations: () => Promise<void>;
  deleteGeneration: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  generations: [],
  isLoading: false,
  isGeneratingInBackground: false,
  error: null,

  generateImage: async (imageUrl: string, variant: string) => {
    set({ isLoading: true, isGeneratingInBackground: true, error: null });
    console.log('Starting image generation process (background state active)...');
    
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUrl,
        name: 'upload.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('variant', variant);
      
      console.log('Sending request to backend...');
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_URL}/api/generation/generate`, formData, {
        timeout: 200000,
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Received response from backend:', response.status);
      
      set((state) => ({
        generations: [response.data, ...state.generations],
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Generation error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      });
      
      let errorMessage = 'Failed to generate image';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, isLoading: false, isGeneratingInBackground: false });
    } finally {
      set({ isLoading: false, isGeneratingInBackground: false });
      console.log('Image generation process finished (background state inactive).');
    }
  },

  fetchGenerations: async () => {
    try {
      set({ isLoading: true, error: null });
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/api/generation/history`, { headers });
      set({ generations: response.data });
    } catch (error) {
      console.error('Fetch error:', error);
      set({ error: 'Failed to fetch generations' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGeneration: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const headers = await getAuthHeaders();
      await axios.delete(`${API_URL}/api/generation/${id}`, { headers });
      set((state) => ({
        generations: state.generations.filter(generation => generation.id !== id),
        isLoading: false,
      }));
      console.log('Generation deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Delete generation error details:', error.response?.data);
      let errorMessage = 'Failed to delete generation';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },
  clearError: () => set({ error: null }),
})); 