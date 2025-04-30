import React, { createContext, useContext, useEffect, useState } from 'react';
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

  const refreshMetadata = async () => {
    setIsLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      // const offerings = { current: { availablePackages: [{ product: { identifier: 'test', title: 'Test', price: 1.99, priceString: '$1.99' } }] } };
      const current = offerings.current;

      if (current && current.availablePackages.length > 0) {
        const map: Record<string, ProductMetadata> = {};
        current.availablePackages.forEach(pkg => {
          const product: PurchasesStoreProduct = pkg.product;
          // const product: any = pkg.product;
          map[product.identifier] = {
            name: product.title,
            price: product.price,            // number (e.g., 1.99)
            priceString: product.priceString // localized (e.g., $1.99)
          };
        });
        console.log('Fetched Product Metadata:', map);
        setMetadataMap(map);
      } else {
        console.log('No current offering or packages found.');
      }
    } catch (e) {
      console.error('Failed to fetch product metadata:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshMetadata();
  }, []);

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