import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { YStack, Button, H1, Text } from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { useGenerationStore } from '@/stores/generation';
import CreateCard from '@/components/CreateCard';

export default function GenerateScreen() {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const { isLoading } = useGenerationStore();
  const [localError, setLocalError] = useState<string | null>(null);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack alignItems="center" marginTop="$6" marginBottom="$4">
          <View style={styles.logoWrapper}>
            <View>
              <Image 
                source={require('@/assets/images/toonify-logo.png')} 
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
          </View>
        </YStack>
        
        <CreateCard 
          error={localError}
          onErrorChange={setLocalError}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoWrapper: {
    width: 360,
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 360,
    height: 360,
  }
});