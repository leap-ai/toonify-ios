import { View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { usePathname } from 'expo-router';

export function TransitionLayout({ children }: { children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pathname = usePathname();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [pathname]);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
} 