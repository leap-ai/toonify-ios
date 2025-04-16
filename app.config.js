import 'dotenv/config';

export default {
  name: 'Toonify',
  slug: 'toonify',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.toonify.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.toonify.app'
  },
  extra: {
    apiUrl: process.env.API_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleExpoClientId: process.env.GOOGLE_EXPO_CLIENT_ID,
    appleClientId: process.env.APPLE_CLIENT_ID,
    betterAuthBaseUrl: process.env.BETTER_AUTH_BASE_URL,
    eas: {
      projectId: process.env.EAS_PROJECT_ID
    }
  },
  plugins: [
    'expo-auth-session',
    'expo-apple-authentication'
  ]
}; 