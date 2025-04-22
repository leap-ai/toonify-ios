import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { ExpoRoot } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { REVENUE_CAT_APPLE_API_KEY } from './config';
import { useCreditsStore } from './stores/credits';

export default function App() {
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (Platform.OS === 'ios') {
      // Configure RevenueCat
      Purchases.configure({apiKey: REVENUE_CAT_APPLE_API_KEY});
    }
  }, []);

  const colorScheme = useColorScheme();
  const ctx = require.context('./app');

  return <ExpoRoot context={ctx} />;
} 