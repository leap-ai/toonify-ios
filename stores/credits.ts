import { create } from 'zustand';
import { API_URL } from '../config';
import { getAuthHeaders } from '@/utils';

interface CreditTransaction {
  id: number;
  userId: number;
  amount: number;
  type: string;
  createdAt: string;
}

interface CreditsState {
  creditsBalance: number;
  history: CreditTransaction[];
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  purchaseCredits: (amount: number) => Promise<void>;
}

export const useCreditsStore = create<CreditsState>((set) => ({
  creditsBalance: 0,
  history: [],
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    try {
      set({ isLoading: true, error: null });
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/credits/balance`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credit balance');
      }

      const data = await response.json();
      set({ creditsBalance: data.creditsBalance });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch credit balance' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/credits/history`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credit history');
      }

      const data = await response.json();
      set({ history: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch credit history' });
    } finally {
      set({ isLoading: false });
    }
  },

  purchaseCredits: async (amount: number) => {
    try {
      set({ isLoading: true, error: null });
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/credits/purchase`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to purchase credits');
      }

      // Refresh balance and history after successful purchase
      await Promise.all([
        useCreditsStore.getState().fetchBalance(),
        useCreditsStore.getState().fetchHistory(),
      ]);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to purchase credits' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 