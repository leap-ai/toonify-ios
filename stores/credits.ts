import { create } from 'zustand';
import { API_URL } from '@/config';
import { getAuthHeaders } from '@/utils';
import { ProductMetadata, PurchaseCompletedEvent } from '@/types';
import { CreditTransaction } from '@/types';

export interface StoreTransaction {
  productIdentifier: string;
  transactionIdentifier: string;
  [key: string]: any;
}

export interface CustomerInfo {
  [key: string]: any;
}

export interface PurchaseErrorEvent {
  error: {
    code: string;
    message: string;
  };
}

export interface RestoreCompletedEvent {
  customerInfo: CustomerInfo;
}

export interface RestoreErrorEvent {
  error: {
    code: string;
    message: string;
  };
}

interface CreditsState {
  creditsBalance: number;
  history: CreditTransaction[];
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchHistory: () => Promise<void>;
}

export const useCreditsStore = create<CreditsState>((set, get) => ({
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
      const response = await fetch(`${API_URL}/api/payments/history`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();
      set({ history: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payment history' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 