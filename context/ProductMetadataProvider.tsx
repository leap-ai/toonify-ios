import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Purchases, { PurchasesStoreProduct } from 'react-native-purchases';
import { ProductMetadata } from '@/utils/types';

type ProductMetadataContextType = {
  metadataMap: Record<string, ProductMetadata>;
  refreshMetadata: () => Promise<void>;
  isLoading: boolean;
};

const ProductMetadataContext = createContext<ProductMetadataContextType | null>(null);

export const ProductMetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metadataMap, setMetadataMap] = useState<Record<string, ProductMetadata>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMetadataFetched, setIsMetadataFetched] = useState(false);

  const refreshMetadata = useCallback(async () => {
    if (isMetadataFetched) {
        return; 
    }

    console.log('Attempting to fetch Product Metadata...');
    setIsLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;

      if (current && current.availablePackages.length > 0) {
        const map: Record<string, ProductMetadata> = {};
        current.availablePackages.forEach(pkg => {
          const product: PurchasesStoreProduct = pkg.product;
          map[product.identifier] = {
            name: product.title,
            price: product.price,
            priceString: product.priceString
          };
        });
        console.log('Fetched Product Metadata:', map);
        setMetadataMap(map);
        setIsMetadataFetched(true);
      } else {
        console.log('No current offering or packages found.');
        setIsMetadataFetched(true); 
      }
    } catch (e) {
      console.error('Failed to fetch product metadata:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isMetadataFetched]);

  useEffect(() => {
    refreshMetadata();
  }, [refreshMetadata]);

  return (
    <ProductMetadataContext.Provider value={{ metadataMap, refreshMetadata, isLoading }}>
      {children}
    </ProductMetadataContext.Provider>
  );
};

// Custom hook to use the context
export function useProductMetadataContext() {
  const ctx = useContext(ProductMetadataContext);

  if (!ctx) {
    throw new Error('useProductMetadataContext must be used within a ProductMetadataProvider');
  }

  return ctx; // Returns { metadataMap, refreshMetadata, isLoading }
} 