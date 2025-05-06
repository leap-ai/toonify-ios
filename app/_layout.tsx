import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '@/tamagui.config';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Platform, useColorScheme } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { REVENUE_CAT_APPLE_API_KEY } from '@/utils/config';
import { ProductMetadataProvider } from '@/context/ProductMetadataProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import AuthHandler from '@/components/AuthHandler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const SafeToastViewport = () => {
  const { top, left, right } = useSafeAreaInsets();
  return (
    <ToastViewport 
      flexDirection="column" 
      top={top + 10}
      left={left}
      right={right} 
      name="global_toast_viewport"
    />
  );
};

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
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
      <ThemeProvider>
        <ProductMetadataProvider>
          <ToastProvider
            swipeDirection="horizontal"
            duration={6000}
            native={Platform.OS !== 'web'}
          >
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
            <SafeToastViewport />
          </ToastProvider>
        </ProductMetadataProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
