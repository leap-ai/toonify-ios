import React from 'react';
import { View, Alert } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useRouter } from 'expo-router';

const Paywall = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        onPurchaseStarted={() => {
          console.log('🔄 Purchase started');
        }}
        onPurchaseCompleted={({ customerInfo, storeTransaction }) => {
          console.log('✅ Purchase completed', { customerInfo, storeTransaction });

          if (storeTransaction?.productIdentifier) {
            // TODO: Send this productIdentifier to your backend to add credits to user's profile
            console.log('Purchased product ID:', storeTransaction.productIdentifier);
            Alert.alert('Success', `Credits purchased: ${storeTransaction.productIdentifier}`);
            router.back();
          } else {
            Alert.alert('Purchase Error', 'No product identifier found in transaction.');
          }
        }}
        onPurchaseCancelled={() => {
          console.log('🚫 Purchase cancelled by user');
          Alert.alert('Purchase Cancelled', 'You cancelled the transaction.');
        }}
        onPurchaseError={({error}) => {
          console.error('❌ Purchase error:', error);
          Alert.alert('Purchase Failed', `${error.code}:${error.message}` || 'Something went wrong with the purchase.');
        }}
        onRestoreStarted={() => {
          console.log('🔁 Restore started');
        }}
        onRestoreCompleted={({ customerInfo }) => {
          console.log('✅ Restore completed', { customerInfo });
          const allTransactions = customerInfo?.allPurchasedProductIdentifiers;
          const latestTransaction = allTransactions![allTransactions.length - 1];

          if (latestTransaction) {
            Alert.alert('Restored', `Restored purchase: ${latestTransaction}`);
          } else {
            Alert.alert('No Purchases Found', 'No valid product found in restored purchases.');
          }
        }}
        onRestoreError={({error}) => {
          console.error('❌ Restore error:', error);
          Alert.alert('Restore Failed', `${error.code}:${error.message}` || 'Could not restore purchases.');
        }}
        onDismiss={() => {
          console.log('👋 Paywall dismissed');
          router.back();
        }}
      />
    </View>
  );
};

export default Paywall;
