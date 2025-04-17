import { Tabs } from 'expo-router';
import { useColorScheme, Text } from 'react-native';

const Colors = {
  light: {
    tint: '#007AFF',
  },
  dark: {
    tint: '#fff',
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Generate',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🎨</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📜</Text>,
        }}
      />
    </Tabs>
  );
}