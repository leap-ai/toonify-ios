import React, { useEffect, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { authClient } from '../stores/auth';
import { View, useColorScheme } from 'react-native';
import { TransitionLayout } from '@/components/TransitionLayout';
import { ProductMetadataProvider } from '@/context/ProductMetadataProvider';
import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  // Example: Load fonts (replace with your actual font loading if any)
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@tamagui/font-inter/otf/Inter-Regular.otf'),
    'Inter-Bold': require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    // Add other fonts you use here
  });

  useEffect(() => {
    // Determine if the app is ready: fonts loaded and auth status checked
    if ((fontsLoaded || fontError) && !isAuthLoading) {
      setAppIsReady(true);
    }
  }, [fontsLoaded, fontError, isAuthLoading]);

  useEffect(() => {
    if (!appIsReady) {
      return; // Don't navigate until app is ready
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (session?.user?.id && inAuthGroup) {
      // If user is logged in and in auth group, redirect to tabs
      router.replace('/(tabs)' as any); 
    } else if (!session?.user?.id && !inAuthGroup) {
      // If user is NOT logged in and NOT in auth group, redirect to the landing page
      router.replace('/(auth)' as any); // Target the (auth) group index
    }
    // No redirection needed if user is in the correct group relative to their auth state
    // (e.g., logged in user in (tabs), logged out user in (auth))

  }, [session, appIsReady, segments, router]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately!
      // Make sure all essential loading is done before this point.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Render nothing until the app is ready and layout is complete
  if (!appIsReady) {
    return null; 
  }

  // App is ready, render the main layout
  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme ?? 'light'}>
      <ProductMetadataProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <TransitionLayout>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Screens accessible when logged in */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              
              {/* Screens accessible when logged out */}
              <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
              {/* Login and Signup are nested within (auth), no need to list explicitly unless customizing options */}
              {/* <Stack.Screen name="(auth)/login" options={{ headerShown: false }} /> */}
              {/* <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} /> */}
              
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </TransitionLayout>
        </View>
      </ProductMetadataProvider>
    </TamaguiProvider>
  );
}