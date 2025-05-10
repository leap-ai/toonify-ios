import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { PurchasesPackage, CustomerInfo as RNPurchasesCustomerInfo, PurchasesStoreTransaction } from 'react-native-purchases';
import { useCredits } from '@/hooks/useCredits';
import { useAppTheme } from '@/context/ThemeProvider';

const Paywall = () => {
  const { 
    isLoading,
    handlePurchaseCompleted,
    handlePurchaseCancelled,
    handlePurchaseError,
    handleDismiss
  } = useCredits();
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();

  const onPurchaseStartedUILog = ({ packageBeingPurchased }: { packageBeingPurchased?: PurchasesPackage }) => {
    console.log('RevenueCatUI.Paywall purchase started for package:', packageBeingPurchased?.product?.identifier);
  };

  const onPurchaseCompletedWrapper = ({ customerInfo, storeTransaction }: { customerInfo: RNPurchasesCustomerInfo; storeTransaction: PurchasesStoreTransaction }) => {
    const productIdentifier = storeTransaction.productIdentifier;
    if (productIdentifier) {
      handlePurchaseCompleted({
        customerInfo,
        productIdentifier: productIdentifier
      });
    }
  };

  return (
    <View style={{ flex: 2, backgroundColor: theme.background }}>
      {isLoading && (
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: theme.overlayBackground, 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000
        }}>
          <ActivityIndicator size="large" color={theme.tint} />
        </View>
      )}
      <RevenueCatUI.Paywall
        style={{
          flex: 1,
        }}
        onPurchaseStarted={onPurchaseStartedUILog}
        onPurchaseCompleted={onPurchaseCompletedWrapper}
        onPurchaseCancelled={handlePurchaseCancelled}
        onPurchaseError={handlePurchaseError}
        onDismiss={handleDismiss}
      />
    </View>
  );
};

export default Paywall;
