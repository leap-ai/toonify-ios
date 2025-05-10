import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler (how notifications are handled when app is foregrounded)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    // Optionally, inform the user that they need to enable notifications in settings
    return null;
  }
  // Normally, you would get a push token for remote notifications:
  // token = (await Notifications.getExpoPushTokenAsync()).data;
  // For local notifications, we don't strictly need the token, but good to have the permission flow.
  console.log('Notification permissions granted.');
  return token; // For local-only, this will be null or you can return 'granted' status string
}

export async function schedulePushNotification(
  title: string, 
  body: string, 
  data?: Record<string, any>
) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
      },
      trigger: null, // immediate notification
    });
    console.log('Notification scheduled successfully:', title);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

export async function cancelAllScheduledNotificationsAsync() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled.');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
} 