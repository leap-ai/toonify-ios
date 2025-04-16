import { create } from 'zustand';
import { useAuthStore } from './auth';

interface CreditTransaction {
  id: number;
  amount: number;
  type: 'purchase' | 'usage' | 'refund';
  createdAt: string;
}

interface CreditsState {
  balance: number;
  transactions: CreditTransaction[];
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  purchaseCredits: (amount: number, paymentId: string) => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const useCreditsStore = create<CreditsState>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/credits/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      set({ balance: data.balance });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTransactions: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/credits/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      set({ transactions: data.transactions });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  purchaseCredits: async (amount: number, paymentId: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/credits/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, paymentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to purchase credits');
      }

      const data = await response.json();
      set((state) => ({
        balance: state.balance + amount,
        transactions: [data.transaction, ...state.transactions],
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 