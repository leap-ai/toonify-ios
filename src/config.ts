import Constants from 'expo-constants';

export const config = {
  api: {
    url: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api',
  },
  google: {
    clientId: Constants.expoConfig?.extra?.googleClientId,
    expoClientId: Constants.expoConfig?.extra?.googleExpoClientId,
  },
  apple: {
    clientId: Constants.expoConfig?.extra?.appleClientId,
  },
  revenuecat: {
    apiKey: Constants.expoConfig?.extra?.revenuecatApiKey,
  },
} as const;

// Validate required environment variables
const requiredEnvVars = [
  'EXPO_PUBLIC_API_URL',
  'EXPO_PUBLIC_GOOGLE_CLIENT_ID',
  'EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID',
  'EXPO_PUBLIC_APPLE_CLIENT_ID',
  'EXPO_PUBLIC_REVENUECAT_API_KEY',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Missing environment variable: ${envVar}`);
  }
} 