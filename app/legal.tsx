import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const LegalScreen = () => {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();

  if (!url) {
    // Handle case where URL is missing, maybe navigate back or show error
    return null; 
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: title || 'Legal', headerBackButtonDisplayMode: 'minimal' }} />
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loadingIndicator} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LegalScreen; 