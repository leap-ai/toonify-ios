import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, User, GalleryThumbnails, Plus } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeProvider';

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
            tabBarIcon: ({ color, size }) => <Plus size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Gallery',
            tabBarIcon: ({ color, size }) => <GalleryThumbnails size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="credits"
          options={{
            title: 'Subscriptions',
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