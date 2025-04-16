import { create } from 'zustand';
import { useAuthStore } from './auth';
import { useCreditsStore } from './credits';

interface Generation {
  id: number;
  originalImageUrl: string;
  generatedImageUrl: string;
  status: 'pending' | 'completed' | 'failed';
  creditsUsed: number;
  createdAt: string;
}

interface GenerationState {
  currentGeneration: Generation | null;
  generations: Generation[];
  isLoading: boolean;
  error: string | null;
  generateCartoon: (imageUrl: string) => Promise<void>;
  fetchGenerations: () => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const useGenerationStore = create<GenerationState>((set, get) => ({
  currentGeneration: null,
  generations: [],
  isLoading: false,
  error: null,

  generateCartoon: async (imageUrl: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/generation/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cartoon');
      }

      const data = await response.json();
      set((state) => ({
        currentGeneration: data.generation,
        generations: [data.generation, ...state.generations],
      }));

      // Update credits balance
      await useCreditsStore.getState().fetchBalance();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchGenerations: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/generation/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch generations');
      }

      const data = await response.json();
      set({ generations: data.generations });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 