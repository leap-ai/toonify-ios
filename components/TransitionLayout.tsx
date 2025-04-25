import { View } from 'react-native';
import { usePathname } from 'expo-router';

export function TransitionLayout({ children }: { children: React.ReactNode }) {
  // We're keeping the pathname reference for potential future use
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
} 