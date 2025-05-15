// frontend-mobile/types.ts

// --- Shared Types ---

// Represents product details fetched from RevenueCat/Provider
export type ProductMetadata = {
    name: string;
    price: number;
    priceString: string;
  };
  
  // Represents the transaction details from RevenueCat
  export interface StoreTransaction {
    productIdentifier: string;
    transactionIdentifier: string;
    [key: string]: any; // Allow other properties
  }
  
  // Represents customer info from RevenueCat
  export interface CustomerInfo {
    [key: string]: any; // Allow other properties
  }
  
  // --- Event Payloads for RevenueCatUI/Handlers ---
  
  export interface PurchaseCompletedEvent {
    customerInfo: CustomerInfo;
    storeTransaction: StoreTransaction;
  }
  
  export interface PurchaseErrorEvent {
    error: {
      code: string;
      message: string;
      // Add other potential error fields if needed
    };
  }
  
  export interface RestoreCompletedEvent {
    customerInfo: CustomerInfo;
  }
  
  export interface RestoreErrorEvent {
    error: {
      code: string;
      message: string;
      // Add other potential error fields if needed
    };
  }
  
  // --- Store Specific Types ---
  
  // Represents a transaction record in our backend/store history
  export interface CreditTransaction {
    id: number;
    userId: number;
    amount: number;
    type?: string;
    createdAt: string;
    status?: string;
    currency?: string;
  }


export interface Generation {
  id: number;
  originalImageUrl: string;
  cartoonImageUrl: string;
  createdAt: string;
}

// Define frontend variant type and options
export type ImageVariantFrontend = 'pixar' | 'ghiblix' | 'sticker' | 'plushy' | 'kawaii' | 'anime';