import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useCreditsStore } from '@/stores/credits';
import { useProductMetadataContext } from '@/context/ProductMetadataProvider';
import { 
  PurchaseCompletedEvent, 
  PurchaseErrorEvent, 
  RestoreCompletedEvent, 
  RestoreErrorEvent,
} from '@/utils/types';

export function useCredits() {
  const router = useRouter();
  const store = useCreditsStore();
  const { metadataMap, isLoading: isMetadataLoading } = useProductMetadataContext();
  
  // Get state and actions from the credits store
  const { 
    creditsBalance, 
    history, 
    isLoading: isCreditsLoading,
    error, 
    fetchBalance,
    fetchHistory,
  } = store;

  // Combine loading states
  const isLoading = isCreditsLoading || isMetadataLoading;
  
  // Fetch initial data
  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, [fetchBalance, fetchHistory]);
  
  // --- Handlers using metadataMap ---

  const handlePurchaseStarted = () => {
    console.log('🔄 Purchase started');
  };

  const handlePurchaseCompleted = async (event: PurchaseCompletedEvent) => {
    console.log('✅ Purchase completed on server', event);
    const productId = event.storeTransaction?.productIdentifier;

    if (productId) {
      const productMetadata = metadataMap[productId];
      const productName = productMetadata?.name || productId;
      
      console.log(`Purchase for ${productName} submitted. Triggering data refresh.`);

      // Show immediate feedback that the purchase was submitted
      // The actual credits are granted server-side via webhook
      Alert.alert(
        'Purchase Submitted', 
        `Your purchase of ${productName} is being processed. Credits will be updated shortly.`
      );

      // Trigger balance and history refresh immediately.
      // This initiates the 'polling' hoping the webhook has processed.
      try {
        // Using Promise.allSettled to ensure both fetches are attempted
        // even if one potentially fails initially.
        await Promise.allSettled([
            fetchBalance(),
            fetchHistory()
        ]);
        console.log('Balance and history refresh triggered after purchase.');
      } catch (refreshError) {
        // Log errors from refreshing, but don't block navigation
        console.error('Error refreshing data after purchase:', refreshError);
      }

      // Navigate to profile immediately for acknowledging the purchase and credits update
      router.replace("/(tabs)/profile");

    } else {
      console.error('Purchase completed event missing product identifier.');
      Alert.alert('Purchase Error', 'Could not identify purchased product. Please contact support.');
    }
  };

  const handlePurchaseCancelled = () => {
    console.log('🚫 Purchase cancelled by user');
    Alert.alert('Purchase Cancelled', 'You cancelled the transaction.');
  };

  const handlePurchaseError = ({ error }: PurchaseErrorEvent) => {
    console.error('❌ Purchase error on client:', error);
    Alert.alert('Purchase Failed', `${error.code}: ${error.message}` || 'Something went wrong with the purchase.');
  };

  const handleDismiss = () => {
    console.log('👋 Paywall dismissed');
    router.back();
  };

  return {
    // State
    creditsBalance,
    history,
    isLoading,
    error,
    
    // Actions
    fetchBalance,
    fetchHistory,
    
    // Handlers
    handlePurchaseStarted,
    handlePurchaseCompleted,
    handlePurchaseCancelled,
    handlePurchaseError,
    handleDismiss
  };
} 