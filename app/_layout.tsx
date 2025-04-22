import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { authClient } from '../stores/auth';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TransitionLayout } from '@/components/TransitionLayout';
import { ProductMetadataProvider } from '@/context/ProductMetadataProvider';

export default function RootLayout() {
  const {
    data: session,
    isPending, //loading state
} = authClient.useSession()

  if (isPending) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <ProductMetadataProvider>
      <TransitionLayout>
        <Stack screenOptions={{ headerShown: false }}>
          {session?.user?.id ? (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </TransitionLayout>
    </ProductMetadataProvider>
  );
}