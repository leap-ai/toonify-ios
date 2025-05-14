import { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useSubscriptionStore } from '@/stores/subscription';
import { useProductMetadataContext } from '@/context/ProductMetadataProvider';
import Purchases, { 
  PurchasesStoreProduct, 
  // CustomerInfo, // Might not be needed from store anymore
  PurchasesError, 
  PurchasesPackage,
  MakePurchaseResult,
  CustomerInfo
} from 'react-native-purchases';
import { usePostHog } from 'posthog-react-native';
import { ANALYTICS_EVENTS } from '@/utils/constants';

// Define PurchaseCompletedEvent and PurchaseErrorEvent locally to avoid import conflicts
// and ensure they match the SDK's usage.
export interface PurchaseCompletedEvent {
  productIdentifier: string;
  customerInfo: CustomerInfo; // Use Purchases.CustomerInfo directly if needed
  priceString?: string;
  currencyCode?: string;
}

export interface PurchaseErrorEvent {
  error: PurchasesError;
}

export function useCredits() {
  const posthog = usePostHog();
  const router = useRouter();
  // Use the renamed store
  const store = useSubscriptionStore();
  const { metadataMap, isLoading: isMetadataLoading, refreshMetadata } = useProductMetadataContext();
  
  // Get state and actions from the subscription store
  const { 
    creditsBalance, 
    history, 
    // customerInfo, // Destructuring commented out, get from RC directly if needed
    isActiveProMember, // Get pro status from store
    proMembershipExpiresAt, // Get expiry from store
    subscriptionInGracePeriod, // Get grace period from store
    isLoading: isStoreLoading,
    error: storeError,
    fetchBalance,
    fetchPaymentsHistory,
    fetchProStatus, // Use the correct fetch function
  } = store;

  // Combine loading states
  const isLoading = isStoreLoading || isMetadataLoading;
  
  // Fetch initial data - now includes fetchProStatus
  useEffect(() => {
    fetchBalance();
    fetchPaymentsHistory();
    fetchProStatus(); // Fetch backend pro status instead of RC CustomerInfo for state
    refreshMetadata();
  }, [fetchBalance, fetchPaymentsHistory, fetchProStatus, refreshMetadata]);
  
  // --- Handlers using metadataMap ---

  const handlePurchaseAttempt = async (product: PurchasesStoreProduct) => {
    if (!product) {
      Alert.alert("Error", "No product selected for purchase.");
      return;
    }
    try {
      console.log(`Attempting purchase for: ${product.identifier}`, product);
      const purchaseResult: MakePurchaseResult = await Purchases.purchaseStoreProduct(product);
      console.log('Purchase successful from SDK', purchaseResult.customerInfo, purchaseResult.productIdentifier);
      handlePurchaseCompleted({
        customerInfo: purchaseResult.customerInfo,
        productIdentifier: purchaseResult.productIdentifier,
        priceString: product.priceString,
        currencyCode: product.currencyCode
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
        productIdentifier: purchaseResult.productIdentifier,
        priceString: pkg.product.priceString,
        currencyCode: pkg.product.currencyCode
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
    const productDetails = metadataMap[productId];
    const productName = productDetails?.name || productId || 'Selected Plan';

      Alert.alert(
      'Purchase Successful', 
      `Your subscription to ${productName} is now active! Credits will be updated shortly if applicable.`
      );

      if (posthog) {
        posthog.capture(ANALYTICS_EVENTS.SUBSCRIPTION_PURCHASED, {
          subscription_plan_id: productId,
          subscription_plan_name: productName,
          subscription_price: metadataMap[productId]?.priceString,
        });
        posthog.capture('$set', { 
          $set: { is_pro_user: true },
        });
      }

    // Refresh backend pro status and credits data
      try {
        await Promise.allSettled([
          fetchProStatus(), // Use fetchProStatus here
          fetchBalance(),
          fetchPaymentsHistory()
        ]);
        console.log('Backend subscription status and credit data refresh triggered after purchase.');
      } catch (refreshError) {
        console.error('Error refreshing data after purchase:', refreshError);
      }
  }, [fetchProStatus, fetchBalance, fetchPaymentsHistory, metadataMap, router, posthog]);

  const handlePurchaseCancelled = () => {
    console.log('🚫 Purchase cancelled by user');
    Alert.alert('Purchase Cancelled', 'You cancelled the transaction.');
  };

  const handlePurchaseError = (event: PurchaseErrorEvent) => {
    console.error('❌ Purchase error:', event.error);
    const purchasesError = event.error;
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
      
      // Refresh backend pro status and potentially credits
      await Promise.allSettled([
        fetchProStatus(), // Use fetchProStatus here
        fetchBalance(),
        fetchPaymentsHistory()
      ]);
    } catch (e) {
      const error = e as PurchasesError;
      console.error('❌ Restore error:', error);
      Alert.alert('Restore Failed', error.message || 'Something went wrong while trying to restore your purchases.');
    }
  };

  const handlePresentPaywall = async (offeringIdentifier?: string) => {
    console.log("Navigating to Paywall screen (/tabs/credits)...");
    router.push('/(tabs)/credits');
  };

  const handleDismiss = () => {
    console.log('👋 Paywall dismissed (if applicable)');
    if (router.canGoBack()) {
    router.back();
    }
  };

  return {
    // State from useSubscriptionStore (backend is source of truth)
    creditsBalance,
    history,
    isActiveProMember,
    proMembershipExpiresAt,
    subscriptionInGracePeriod,
    isLoading,
    error: storeError,
    // Metadata and other state
    products: metadataMap,
    
    // Actions from store
    fetchBalance,
    fetchPaymentsHistory,
    fetchProStatus,
    
    // Handlers
    handlePurchaseAttempt,
    handlePurchasePackage,
    handlePurchaseCompleted,
    handlePurchaseCancelled,
    handlePurchaseError,
    handleRestorePurchases,
    handlePresentPaywall,
    handleDismiss,
  };
} 

// Note: The `presentPaywall` utility function in `@/utils/paywallPresentation` needs to be created.
// It will encapsulate the logic for fetching offerings and presenting the paywall using `react-native-purchases-ui`. 