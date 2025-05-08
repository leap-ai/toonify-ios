import { create } from 'zustand';
import { API_URL } from '@/utils/config';
import { getAuthHeaders } from '@/stores/auth';
import { CreditTransaction } from '@/utils/types';
import Purchases, { CustomerInfo, PurchasesError } from 'react-native-purchases';

export interface PurchaseErrorEvent {
  error: PurchasesError;
}

export interface RestoreCompletedEvent {
  customerInfo: CustomerInfo;
}

export interface RestoreErrorEvent {
  error: PurchasesError;
}

const PRO_ENTITLEMENT_ID = "pro";

interface CreditsAndSubscriptionState {
  creditsBalance: number;
  history: CreditTransaction[];
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchCustomerInfo: () => Promise<void>;
}

export const useCreditsStore = create<CreditsAndSubscriptionState>((set, get) => ({
  creditsBalance: 0,
  history: [],
  customerInfo: null,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/credits/balance`, {
        headers,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch credit balance: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      set({ creditsBalance: data.creditsBalance, isLoading: false });
    } catch (error) {
      console.error("Error fetching balance:", error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch credit balance', isLoading: false });
    }
  },

  fetchHistory: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/payments/history`, {
        headers,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch payment history: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      set({ history: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching history:", error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payment history', isLoading: false });
    }
  },

  fetchCustomerInfo: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const customerInfoData = await Purchases.getCustomerInfo();
      console.log('Fetched CustomerInfo from RC SDK.', customerInfoData.entitlements.active);
      set({ 
        customerInfo: customerInfoData, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to fetch Customer Info from RC SDK:', error);
      const errorMessage = (error as PurchasesError)?.message || 'Failed to fetch subscription status from RC SDK';
      set({ error: errorMessage, isLoading: false });
    }
  },
})); 