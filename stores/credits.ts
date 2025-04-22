import { create } from 'zustand';
import { API_URL } from '../config';
import { getAuthHeaders } from '@/utils';
import { ProductMetadata, PurchaseCompletedEvent } from '@/types';

interface CreditTransaction {
  id: number;
  userId: number;
  amount: number;
  type: string;
  createdAt: string;
}

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
  purchaseCredits: (event: PurchaseCompletedEvent, productMetadata: ProductMetadata | null) => Promise<boolean>;
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

  purchaseCredits: async (event, productMetadata) => {
    const { storeTransaction } = event;
    
    if (!storeTransaction?.productIdentifier) {
      console.error('No product identifier found in transaction');
      set({ error: 'No product identifier found in transaction' });
      return false;
    }

    if (!productMetadata) {
      console.error('No product metadata found for purchase');
      set({ error: 'No product metadata found for purchase' });
      return false;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      const productId = storeTransaction.productIdentifier;
      const creditAmount = productMetadata.price;
      
      if (creditAmount <= 0) {
        console.error('Invalid credit amount from product metadata:', creditAmount);
        throw new Error('Invalid credit amount from product metadata');
      }
      
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/credits/purchase`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: creditAmount,
          transactionId: storeTransaction.transactionIdentifier,
          productId: productId,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Server error response:', errorBody);
        throw new Error(`Failed to update credits on server: ${response.statusText}`);
      }

      await Promise.all([
        get().fetchBalance(),
        get().fetchHistory(),
      ]);
      
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error processing purchase:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process purchase';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },
})); 