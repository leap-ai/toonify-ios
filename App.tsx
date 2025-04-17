import { ExpoRoot } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme();
  const ctx = require.context('./app');

  return <ExpoRoot context={ctx} />;
} 