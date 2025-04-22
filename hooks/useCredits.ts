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
  ProductMetadata
} from '@/types';

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
    purchaseCredits
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
    console.log('✅ Purchase completed', event);
    const productId = event.storeTransaction?.productIdentifier;

    if (productId) {
      const productMetadata = metadataMap[productId];
      const productName = productMetadata?.name || productId;
      
      if (!productMetadata) {
        console.warn('Product metadata not found for ID:', productId);
        Alert.alert('Error', 'Product details not found. Please try again later.');
        return;
      }

      try {
        const success = await purchaseCredits(event, productMetadata);
        
        if (success) {
          Alert.alert('Success', `Credits purchased: ${productName}`);
          router.back();
        } else {
          Alert.alert('Error', store.error || 'Failed to process purchase. Please contact support.');
        }
      } catch (error) {
        console.error('Error calling purchaseCredits from hook:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please contact support.');
      }
    } else {
      Alert.alert('Purchase Error', 'No product identifier found in transaction.');
    }
  };

  const handlePurchaseCancelled = () => {
    console.log('🚫 Purchase cancelled by user');
    Alert.alert('Purchase Cancelled', 'You cancelled the transaction.');
  };

  const handlePurchaseError = ({ error }: PurchaseErrorEvent) => {
    console.error('❌ Purchase error:', error);
    Alert.alert('Purchase Failed', `${error.code}: ${error.message}` || 'Something went wrong with the purchase.');
  };

  const handleRestoreStarted = () => {
    console.log('🔁 Restore started');
  };

  const handleRestoreCompleted = ({ customerInfo }: RestoreCompletedEvent) => {
    console.log('✅ Restore completed', { customerInfo });
    const allTransactions = customerInfo?.allPurchasedProductIdentifiers;
    
    if (allTransactions && allTransactions.length > 0) {
      const latestTransactionId = allTransactions[allTransactions.length - 1];
      const productMetadata = metadataMap[latestTransactionId];
      const productName = productMetadata?.name || latestTransactionId;
      Alert.alert('Restored', `Restored purchase: ${productName}`);
    } else {
      Alert.alert('No Purchases Found', 'No previous purchases found to restore.');
    }
  };

  const handleRestoreError = ({ error }: RestoreErrorEvent) => {
    console.error('❌ Restore error:', error);
    Alert.alert('Restore Failed', `${error.code}: ${error.message}` || 'Could not restore purchases.');
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
    purchaseCredits,
    
    // Handlers
    handlePurchaseStarted,
    handlePurchaseCompleted,
    handlePurchaseCancelled,
    handlePurchaseError,
    handleRestoreStarted,
    handleRestoreCompleted,
    handleRestoreError,
    handleDismiss
  };
} 