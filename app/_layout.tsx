import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '@/tamagui.config';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { authClient } from '@/stores/auth';

import { Platform, useColorScheme } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { REVENUE_CAT_APPLE_API_KEY } from '@/utils/config';
import { ProductMetadataProvider } from '@/context/ProductMetadataProvider';
import { ThemeProvider } from '@/context/ThemeProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  // useEffect(() => {
  //   Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  //   if (Platform.OS === 'ios') {
  //     Purchases.configure({apiKey: REVENUE_CAT_APPLE_API_KEY});
  //   }
  // }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) {
      return; // Don't navigate until app is ready
    } else {
      SplashScreen.hideAsync();
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (session?.user?.id && inAuthGroup) {
      // If user is logged in and in auth group, redirect to tabs
      router.replace('/(tabs)'); 
    } else if (!session?.user?.id && !inAuthGroup) {
      // If user is NOT logged in and NOT in auth group, redirect to the landing page
      router.replace('/(auth)'); // Target the (auth) group index
    }
    // No redirection needed if user is in the correct group relative to their auth state
    // (e.g., logged in user in (tabs), logged out user in (auth))

  }, [session, segments, router]);

  if (!loaded) {
    return null;
  }

  return (
    // Pass the dynamically determined initial theme to TamaguiProvider
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
      <ThemeProvider>
        <ProductMetadataProvider>
        {/* Wrap the rest of the app with your custom theme context provider */}
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Screens accessible when logged out */}
            <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
            
            <Stack.Screen name="+not-found" />
            {/* <Stack.Screen name="privacy-policy" />
            <Stack.Screen name="terms-and-conditions" /> */}
          </Stack>
          <StatusBar style="auto" />
        </ProductMetadataProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
