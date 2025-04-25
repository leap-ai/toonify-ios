import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '@env';
import { getAuthHeaders } from '@/utils';

export interface Generation {
  id: number;
  originalImageUrl: string;
  cartoonImageUrl: string;
  createdAt: string;
}

interface GenerationState {
  generations: Generation[];
  isLoading: boolean;
  error: string | null;
  generateImage: (imageUrl: string) => Promise<void>;
  fetchGenerations: () => Promise<void>;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  generations: [],
  isLoading: false,
  error: null,

  generateImage: async (imageUrl: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Starting image generation process...');
      
      // Create form data with image Uri
      const formData = new FormData();
      formData.append('image', {
        uri: imageUrl,
        name: 'upload.jpg',
        type: 'image/jpeg',
      } as any);
      
      console.log('Sending request to backend...');
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_URL}/api/generation/generate`, formData, {
        timeout: 200000, // 200 second timeout for image processing
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Received response from backend:', response.status);
      
      set((state) => ({
        generations: [response.data, ...state.generations],
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
      
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
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
})); 