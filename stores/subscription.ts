import { create } from 'zustand';
import { API_URL } from '@/utils/config';
import { getAuthHeaders } from '@/stores/auth';
import { CreditTransaction } from '@/utils/types';
// Remove RC imports if CustomerInfo is no longer stored or needed here
// import Purchases, { CustomerInfo, PurchasesError } from 'react-native-purchases';

// Remove RC-specific event interfaces if no longer needed
// export interface PurchaseErrorEvent { error: PurchasesError; }
// export interface RestoreCompletedEvent { customerInfo: CustomerInfo; }
// export interface RestoreErrorEvent { error: PurchasesError; }

// Remove if not used
// const PRO_ENTITLEMENT_ID = "pro";

// Define the shape of the data coming from /api/subscription/pro
interface ProStatusResponse {
  creditsBalance: number;
  isProMember: boolean;
  proMembershipExpiresAt: string | null; // Date comes as string
  subscriptionInGracePeriod: boolean | null;
}

interface SubscriptionState {
  creditsBalance: number;
  history: CreditTransaction[];
  // customerInfo: CustomerInfo | null; // REMOVED - No longer fetching/storing raw RC CustomerInfo here
  isActiveProMember: boolean; // Sourced from backend
  proMembershipExpiresAt: Date | null; // Store as Date object
  subscriptionInGracePeriod: boolean;
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchPaymentsHistory: () => Promise<void>;
  fetchProStatus: () => Promise<void>; // Renamed from fetchCustomerInfo
}

// Renamed store hook
export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  creditsBalance: 0,
  history: [],
  // customerInfo: null, // REMOVED
  isActiveProMember: false,
  proMembershipExpiresAt: null,
  subscriptionInGracePeriod: false,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const headers = await getAuthHeaders();
      // Path updated to /api/subscription/balance
      const response = await fetch(`${API_URL}/api/subscription/balance`, {
        headers,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch credit balance: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      // Update only creditsBalance, leave other pro status fields untouched
      set({ creditsBalance: data.creditsBalance, isLoading: false });
    } catch (error) {
      console.error("Error fetching balance:", error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch credit balance', isLoading: false });
    }
  },

  fetchPaymentsHistory: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const headers = await getAuthHeaders();
      // Path remains /api/payments/history as it deals with payment records
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

  // Renamed and rewritten to fetch from backend
  fetchProStatus: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const headers = await getAuthHeaders();
      if (!headers.Cookie) {
        console.log('No auth cookie found, skipping fetchProStatus.');
        set({ isLoading: false, isActiveProMember: false, proMembershipExpiresAt: null, subscriptionInGracePeriod: false, creditsBalance: 0 }); // Reset state on no auth
        return;
      }
      // Call the new backend endpoint
      const response = await fetch(`${API_URL}/api/subscription/pro`, {
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          set({ isLoading: false, error: 'User not authenticated for pro status', isActiveProMember: false, proMembershipExpiresAt: null, subscriptionInGracePeriod: false, creditsBalance: 0 });
          return;
        }
        const errorData = await response.text();
        throw new Error(`Failed to fetch pro status: ${response.status} ${errorData}`);
      }

      const data: ProStatusResponse = await response.json();
      
      // Update state from backend response
      set({ 
        isActiveProMember: data.isProMember,
        proMembershipExpiresAt: data.proMembershipExpiresAt ? new Date(data.proMembershipExpiresAt) : null,
        subscriptionInGracePeriod: data.subscriptionInGracePeriod ?? false, // Default to false if null
        creditsBalance: data.creditsBalance, // Update credits balance as well from this endpoint
        isLoading: false,
        error: null, // Clear error on success
      });
    } catch (error) {
      console.error('Failed to fetch pro status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pro status';
      set({ error: errorMessage, isLoading: false, isActiveProMember: false, proMembershipExpiresAt: null, subscriptionInGracePeriod: false }); // Reset on error
    }
  },
})); 