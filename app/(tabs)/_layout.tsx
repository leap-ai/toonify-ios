import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, History, CreditCard, User } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeProvider';

// Define a more comprehensive theme system that will be used across all tab screens
export const Colors = {
  light: {
    tint: '#007AFF',
    background: '#FFFFFF',
    card: '#F5F5F5',
    cardBorder: '#E0E0E0',
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#999999',
      accent: '#007AFF',
      error: '#FF3B30',
      success: '#34C759',
    },
    headerBackground: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E5E5',
    separator: '#E5E5E5',
    screenBackground: '#F9F9F9',
  },
  dark: {
    tint: '#0A84FF',
    background: '#121212',
    card: '#1E1E1E',
    cardBorder: '#333333',
    text: {
      primary: '#FFFFFF',
      secondary: '#BBBBBB',
      tertiary: '#888888',
      accent: '#0A84FF',
      error: '#FF453A',
      success: '#30D158',
    },
    headerBackground: '#1A1A1A',
    tabBarBackground: '#1A1A1A',
    tabBarBorder: '#333333',
    separator: '#333333',
    screenBackground: '#121212',
  },
};

export default function TabLayout() {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tint,
          tabBarInactiveTintColor: theme.text.tertiary,
          tabBarStyle: {
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.tabBarBorder,
            elevation: 0,
            shadowOpacity: 0,
            height: 60,
            paddingBottom: 6,
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Create',
            tabBarIcon: ({ color, size }) => <Home size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => <History size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="credits"
          options={{
            title: 'Credits',
            tabBarIcon: ({ color, size }) => <CreditCard size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="change-password"
          options={{
            title: 'Change Password',
            href: null,
            tabBarIcon: ({ color, focused }) => (
              <User color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}