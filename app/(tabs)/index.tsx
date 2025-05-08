import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, Animated, Platform } from 'react-native';
import { useAppTheme } from '@/context/ThemeProvider';
import { useSubscriptionStore } from '@/stores/subscription';
import { useGenerationStore } from '@/stores/generation';
import CreateCard from '@/components/CreateCard';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect } from 'expo-router';
import { 
  registerForPushNotificationsAsync, 
  schedulePushNotification 
} from '@/utils/notifications';
import { useCredits } from '@/hooks/useCredits';

// Define frontend variant type and options
export type ImageVariantFrontend = 'pixar' | 'ghiblix' | 'sticker' | 'plushy';

export const VARIANT_OPTIONS: { 
  label: string; 
  value: ImageVariantFrontend; 
  image: any; 
  isPro: boolean;
}[] = [
  { label: 'Ghibli', value: 'ghiblix', image: require('@/assets/images/ghiblix.png'), isPro: false },
  { label: 'Sticker', value: 'sticker', image: require('@/assets/images/sticker.png'), isPro: true },
  { label: 'Pixar', value: 'pixar', image: require('@/assets/images/pixar.png'), isPro: true },
  { label: 'Plushy', value: 'plushy', image: require('@/assets/images/plushy.png'), isPro: true },
];

export default function GenerateScreen() {
  const router = useRouter();
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const {
    generateImage,
    isGeneratingInBackground,
    error,
    clearError,
  } = useGenerationStore();
  const { isActiveProMember } = useSubscriptionStore();
  const { isLoading: isCreditsLoading } = useCredits();

  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ImageVariantFrontend>(VARIANT_OPTIONS[0].value);
  
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (error) {
        schedulePushNotification('Generation Failed', error);
        clearError(); 
      }
    }, [error, clearError])
  );

  const handleDismissImage = () => {
      setSelectedImage(null);
    setLocalError(null); 
  };

  const pickImage = async () => {
    try {
      setLocalError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      const errorMessage = 'Failed to pick image. Please try again.';
      setLocalError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      const errorMessage = 'Please select an image first.';
      setLocalError(errorMessage);
      Alert.alert('Error', errorMessage);
      return;
    }

    schedulePushNotification('Generation Started', `Your ${selectedVariant} is being created.`);

    try {
      await generateImage(selectedImage, selectedVariant);
      const genError = useGenerationStore.getState().error;
      if (!genError) {
      router.push('/(tabs)/history');
        schedulePushNotification('Toonified Picture Ready!', `Open app to see your new ${selectedVariant} image.`);
        setSelectedImage(null);
        setLocalError(null);
      } 
    } catch (err) {
      console.error('Error during generateImage call in component:', err);
      if (!useGenerationStore.getState().error) {
        const errorMessage = 'Failed to generate image. Please try again.';
      setLocalError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        <CreateCard 
          error={localError}
          selectedImage={selectedImage}
          isLoading={isGeneratingInBackground || isCreditsLoading}
          onPickImage={pickImage}
          onGenerate={handleGenerate}
          variants={VARIANT_OPTIONS}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          onDismissImage={handleDismissImage}
          isActiveProMember={isActiveProMember}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50
  },
  logo: {
    marginBottom: 10,
    width: 24,
    height: 24,
  }
});