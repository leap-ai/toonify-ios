import { Tabs } from 'expo-router';
import { useColorScheme, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Colors = {
  light: {
    tint: '#007AFF',
    background: '#fff',
  },
  dark: {
    tint: '#fff',
    background: '#000',
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: '#e5e5e5',
          },
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
        <Tabs.Screen
          name="credits"
          options={{
            title: 'Credits',
            tabBarIcon: ({ color }) => <Text style={{ color }}>💎</Text>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}