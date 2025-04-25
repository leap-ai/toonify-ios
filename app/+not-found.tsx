import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerStyle: { backgroundColor: isDark ? '#121212' : '#FFFFFF' }, headerTintColor: isDark ? '#FFFFFF' : '#000000' }} />
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <Text style={[styles.text, { color: isDark ? '#FFFFFF' : '#000000' }]}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={{ color: '#007AFF' }}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
