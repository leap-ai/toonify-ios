import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { ExpoRoot } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import { REVENUE_CAT_APPLE_API_KEY } from './config';
import config from './tamagui.config';
import { ThemeProvider } from './context/ThemeProvider';

export default function App() {
  // Configure RevenueCat
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (Platform.OS === 'ios') {
      Purchases.configure({apiKey: REVENUE_CAT_APPLE_API_KEY});
    }
  }, []);

  const ctx = require.context('./app');

  return (
    <TamaguiProvider config={config}>
      <ThemeProvider>
        <ExpoRoot context={ctx} />
      </ThemeProvider>
    </TamaguiProvider>
  );
} 