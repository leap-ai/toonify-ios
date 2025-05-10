import React from 'react';
import PaywallComponent from '@/components/Paywall';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeProvider';
import { Stack } from 'expo-router';

const PaywallScreen = () => {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.screenBackground }}>
      <Stack.Screen 
        options={{
          title: "Join Toonify Pro",
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
        }} 
      />
      <PaywallComponent />
    </SafeAreaView>
  );
};

export default PaywallScreen; 