import { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useCreditsStore } from '@/stores/credits';
import { useProductMetadataContext } from '@/context/ProductMetadataProvider';
import Purchases, { 
  PurchasesStoreProduct, 
  CustomerInfo, 
  PurchasesError, 
  PurchasesPackage,
  MakePurchaseResult
} from 'react-native-purchases';

// Define PurchaseCompletedEvent and PurchaseErrorEvent locally to avoid import conflicts
// and ensure they match the SDK's usage.
export interface PurchaseCompletedEvent {
  productIdentifier: string;
  customerInfo: CustomerInfo;
}

export interface PurchaseErrorEvent {
  error: PurchasesError;
}

export function useCredits() {
  const router = useRouter();
  const store = useCreditsStore();
  const { metadataMap, isLoading: isMetadataLoading, refreshMetadata } = useProductMetadataContext();
  
  // Get state and actions from the credits store
  const { 
    creditsBalance, 
    history, 
    customerInfo,
    isLoading: isStoreLoading,
    error: storeError,
    fetchBalance,
    fetchHistory,
    fetchCustomerInfo,
  } = store;

  // Combine loading states
  const isLoading = isStoreLoading || isMetadataLoading;
  
  // Fetch initial data for both credits and subscription status
  useEffect(() => {
    fetchBalance();
    fetchHistory();
    fetchCustomerInfo();
    refreshMetadata(); // Ensure product metadata for subscriptions is fresh
  }, [fetchBalance, fetchHistory, fetchCustomerInfo, refreshMetadata]);
  
  // --- Handlers using metadataMap ---

  const handlePurchaseAttempt = async (product: PurchasesStoreProduct) => {
    if (!product) {
      Alert.alert("Error", "No product selected for purchase.");
      return;
    }
    try {
      console.log(`Attempting purchase for: ${product.identifier}`);
      const purchaseResult: MakePurchaseResult = await Purchases.purchaseStoreProduct(product);
      console.log('Purchase successful from SDK', purchaseResult.customerInfo, purchaseResult.productIdentifier);
      handlePurchaseCompleted({
        customerInfo: purchaseResult.customerInfo,
        productIdentifier: purchaseResult.productIdentifier
      });
    } catch (e) {
      const error = e as PurchasesError;
      if (!error.userCancelled) {
        console.error('Purchase error from SDK:', error);
        handlePurchaseError({ error });
      } else {
        console.log('Purchase cancelled by user');
        handlePurchaseCancelled();
      }
    }
  };

  const handlePurchasePackage = async (pkg: PurchasesPackage) => {
    if (!pkg) {
      Alert.alert("Error", "No package selected for purchase.");
      return;
    }
    try {
      console.log(`Attempting purchase for package: ${pkg.identifier} (${pkg.product.identifier})`);
      const purchaseResult: MakePurchaseResult = await Purchases.purchasePackage(pkg);
      console.log('Package purchase successful from SDK', purchaseResult.customerInfo, purchaseResult.productIdentifier);
      handlePurchaseCompleted({
        customerInfo: purchaseResult.customerInfo,
        productIdentifier: purchaseResult.productIdentifier
      });
    } catch (e) {
      const error = e as PurchasesError;
      if (!error.userCancelled) {
        console.error('Package purchase error from SDK:', error);
        handlePurchaseError({ error });
      } else {
        console.log('Package purchase cancelled by user');
        handlePurchaseCancelled();
      }
    }
  };

  const handlePurchaseCompleted = useCallback(async (event: PurchaseCompletedEvent) => {
    console.log('✅ Purchase completed, processing...', event);
    const productId = event.productIdentifier;
    const productName = metadataMap[productId]?.name || productId || 'Selected Plan';

      Alert.alert(
      'Purchase Successful', 
      `Your subscription to ${productName} is now active! Credits will be updated shortly if applicable.`
      );

    // Refresh customer info (for subscription status) and credits data
      try {
        await Promise.allSettled([
        fetchCustomerInfo(),
            fetchBalance(),
            fetchHistory()
        ]);
      console.log('Subscription and credit data refresh triggered after purchase.');
      } catch (refreshError) {
        console.error('Error refreshing data after purchase:', refreshError);
      }

    // Navigate to profile or a relevant screen
      router.replace("/(tabs)/profile");
  }, [fetchCustomerInfo, fetchBalance, fetchHistory, metadataMap, router]);

  const handlePurchaseCancelled = () => {
    console.log('🚫 Purchase cancelled by user');
    Alert.alert('Purchase Cancelled', 'You cancelled the transaction.');
  };

  const handlePurchaseError = (event: PurchaseErrorEvent) => {
    console.error('❌ Purchase error:', event.error);
    const purchasesError = event.error; // Already typed as PurchasesError by the interface
    const readableMessage = purchasesError.userInfo?.readableErrorCode || purchasesError.message;
    Alert.alert('Purchase Failed', `${purchasesError.code}: ${readableMessage}` || 'Something went wrong with the purchase.');
  };

  const handleRestorePurchases = async () => {
    try {
      console.log('🔄 Restoring purchases...');
      const restoredCustomerInfo = await Purchases.restorePurchases();
      console.log('✅ Restore successful', restoredCustomerInfo);

      if (restoredCustomerInfo.activeSubscriptions.length > 0 || Object.keys(restoredCustomerInfo.entitlements.active).length > 0) {
        Alert.alert('Restore Successful', 'Your previous purchases have been restored.');
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
      }
      
      // Refresh customer info and potentially credits
      await Promise.allSettled([
        fetchCustomerInfo(),
        fetchBalance(), // Credits might be granted server-side on restore too
        fetchHistory()
      ]);
    } catch (e) {
      const error = e as PurchasesError;
      console.error('❌ Restore error:', error);
      Alert.alert('Restore Failed', error.message || 'Something went wrong while trying to restore your purchases.');
    }
  };

  const handlePresentPaywall = async (offeringIdentifier?: string) => {
    console.log("Navigating to Paywall screen (/tabs/credits)...");
    // If your Paywall screen needs the offeringIdentifier, pass it as a param:
    // router.push({ pathname: '/(tabs)/credits', params: { offeringIdentifier } });
    router.push('/(tabs)/credits');
  };

  const handleDismiss = () => {
    console.log('👋 Paywall dismissed (if applicable)');
    if (router.canGoBack()) {
    router.back();
    }
  };

  return {
    // State
    creditsBalance,
    history,
    customerInfo,
    isLoading,
    error: storeError, // Make sure to expose the error from the store
    products: metadataMap, // Expose product metadata, which now includes subscriptions
    
    // Actions from store (if direct access needed, though usually used internally by hook)
    fetchBalance,
    fetchHistory,
    fetchCustomerInfo,
    
    // Handlers
    handlePurchaseAttempt, // For purchasing a specific product
    handlePurchasePackage, // For purchasing a specific package from an offering
    handlePurchaseCompleted,
    handlePurchaseCancelled,
    handlePurchaseError,
    handleRestorePurchases,
    handlePresentPaywall,   // To navigate to the screen rendering Paywall.tsx
    handleDismiss, // Used by Paywall.tsx
  };
} 

// Note: The `presentPaywall` utility function in `@/utils/paywallPresentation` needs to be created.
// It will encapsulate the logic for fetching offerings and presenting the paywall using `react-native-purchases-ui`. 