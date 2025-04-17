import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuthStore } from './auth';

interface Generation {
  id: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  status: 'pending' | 'completed';
  creditsUsed: number;
  createdAt: string;
}

interface GenerationState {
  generations: Generation[];
  isLoading: boolean;
  error: string | null;
  generateImage: (imageUrl: string) => Promise<void>;
  fetchHistory: () => Promise<void>;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  generations: [],
  isLoading: false,
  error: null,
  generateImage: async (imageUrl: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = useAuthStore.getState().token;
      const response = await axios.post(
        `${API_URL}/generation/create`,
        { imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        generations: [response.data.generation, ...state.generations],
      }));
    } catch (error) {
      set({ error: 'Failed to generate image' });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = useAuthStore.getState().token;
      const response = await axios.get(`${API_URL}/generation/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ generations: response.data.generations });
    } catch (error) {
      set({ error: 'Failed to fetch generation history' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 