import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useCredits } from '@/hooks/useCredits';
import { useAppTheme } from '@/context/ThemeProvider';

const Paywall = () => {
  const { 
    isLoading,
    handlePurchaseStarted,
    handlePurchaseCompleted,
    handlePurchaseCancelled,
    handlePurchaseError,
    handleRestoreStarted,
    handleRestoreCompleted,
    handleRestoreError,
    handleDismiss
  } = useCredits();
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
        onPurchaseStarted={handlePurchaseStarted}
        onPurchaseCompleted={handlePurchaseCompleted}
        onPurchaseCancelled={handlePurchaseCancelled}
        onPurchaseError={handlePurchaseError}
        onRestoreStarted={handleRestoreStarted}
        onRestoreCompleted={handleRestoreCompleted}
        onRestoreError={handleRestoreError}
        onDismiss={handleDismiss}
      />
    </View>
  );
};

export default Paywall;
