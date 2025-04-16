import { create } from 'zustand';
import { useAuthStore } from './auth';
import { useCreditsStore } from './credits';

interface Product {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
}

interface PaymentsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  purchaseProduct: (productId: string) => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const usePaymentsStore = create<PaymentsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/payments/products`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      set({ products: data.products });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  purchaseProduct: async (productId: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      // This is a placeholder for RevenueCat integration
      // In a real implementation, you would:
      // 1. Call RevenueCat's purchase method
      // 2. Get the transaction ID from RevenueCat
      // 3. Call your backend to record the purchase
      // 4. Update the credits balance

      const product = get().products.find((p) => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Simulate RevenueCat purchase
      const mockTransactionId = `rc_${Date.now()}`;

      // Record the purchase in your backend
      await useCreditsStore.getState().purchaseCredits(
        product.credits,
        mockTransactionId
      );
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 