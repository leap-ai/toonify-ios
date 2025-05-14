import { PostHogProvider } from 'posthog-react-native'
import { TamaguiProvider } from 'tamagui';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Platform, useColorScheme } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import tamaguiConfig from '@/tamagui.config';
import { POSTHOG_KEY, REVENUE_CAT_APPLE_API_KEY, POSTHOG_HOST } from '@/utils/config';
import { ProductMetadataProvider } from '@/context/ProductMetadataProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import AuthHandler from '@/components/AuthHandler';
import { POSTHOG_SESSION_REPLAY_CONFIG } from '@/utils/constants';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const [loaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (Platform.OS === 'ios') {
      Purchases.configure({apiKey: REVENUE_CAT_APPLE_API_KEY});
    }
  }, []);

  useEffect(() => {
    if (loaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [loaded, fontError]);

  if (!loaded && !fontError) {
    return null;
  }

  if (fontError) {
    console.error("Font loading error - rendering fallback:", fontError);
    return null;
  }

  return (
    <PostHogProvider apiKey={POSTHOG_KEY} options={{
      host: POSTHOG_HOST,
      // Enable session recording. Requires enabling in your project settings as well.
      enableSessionReplay: true,
      sessionReplayConfig: POSTHOG_SESSION_REPLAY_CONFIG,
    }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
        <ThemeProvider>
          <ProductMetadataProvider>
            <AuthHandler />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)/index" />
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(auth)/signup" />
              <Stack.Screen 
                name="legal" 
                options={{ 
                  headerShown: true,
                }} 
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ProductMetadataProvider>
        </ThemeProvider>
      </TamaguiProvider>
    </PostHogProvider>
  );
}
