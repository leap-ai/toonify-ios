import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, Animated, Platform } from 'react-native';
import { useAppTheme } from '@/context/ThemeProvider';
import { useGenerationStore } from '@/stores/generation';
import CreateCard from '@/components/CreateCard';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect } from 'expo-router';
import { useLogoSpinAnimation } from '@/hooks/useLogoSpin';
import { useToastController } from '@tamagui/toast';
import { 
  registerForPushNotificationsAsync, 
  schedulePushNotification 
} from '@/utils/notifications';

// Define frontend variant type and options
export type ImageVariantFrontend = 'pixar' | 'ghiblix' | 'sticker' | 'plushy';

export const VARIANT_OPTIONS: { label: string; value: ImageVariantFrontend; image: any }[] = [
  { label: 'Ghibli', value: 'ghiblix', image: require('@/assets/images/ghiblix.png') },
  { label: 'Sticker', value: 'sticker', image: require('@/assets/images/sticker.png') },
  { label: 'Pixar', value: 'pixar', image: require('@/assets/images/pixar.png') },
  { label: 'Plushy', value: 'plushy', image: require('@/assets/images/plushy.png') },
];

const CURRENT_TOAST_ID = 'generation_toast';

export default function GenerateScreen() {
  const router = useRouter();
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const {
    generateImage,
    isLoading,
    isGeneratingInBackground,
    error,
    clearError,
  } = useGenerationStore();
  const toast = useToastController();

  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ImageVariantFrontend>(VARIANT_OPTIONS[0].value);
  
  const logoAnimation = useLogoSpinAnimation(2000, false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (isGeneratingInBackground) {
        toast.show('Generation in Progress', {
          id: CURRENT_TOAST_ID,
          message: 'Your image is still being created...',
          duration: 0,
          native: Platform.OS !== 'web',
          viewportName: "global_toast_viewport",
        });
      } else {
        toast.hide();
      }

      if (error) {
        toast.show('Generation Failed', {
          id: CURRENT_TOAST_ID + '_error',
          message: error,
          native: Platform.OS !== 'web',
          burntOptions: { preset: 'error' },
          viewportName: "global_toast_viewport",
        });
        schedulePushNotification('Generation Failed', error);
        clearError(); 
      }

      return () => {
        // toast.hide(); // Optionally hide general toasts on blur if not using ID specific logic
      };
    }, [isGeneratingInBackground, error, toast, clearError])
  );
  
  useEffect(() => {
    if (!isLoading && !isGeneratingInBackground) {
      logoAnimation.stop();
    }
  }, [isLoading, isGeneratingInBackground, logoAnimation]);

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

    logoAnimation.start();
    toast.show('Generation Started', {
      id: CURRENT_TOAST_ID,
      message: 'Your image is being created in the background...',
      duration: 0,
      native: Platform.OS !== 'web',
      viewportName: "global_toast_viewport",
    });
    schedulePushNotification('Generation Started', 'Your image is being created in the background.');

    try {
      await generateImage(selectedImage, selectedVariant);
      const genError = useGenerationStore.getState().error;
      if (!genError) {
        router.push('/(tabs)/history');
        toast.show('Image Ready!', {
          id: CURRENT_TOAST_ID + '_success',
          message: 'Your new image has been generated.',
          native: Platform.OS !== 'web',
          burntOptions: { preset: 'done' },
          viewportName: "global_toast_viewport",
        });
        schedulePushNotification('Image Ready!', 'Your new image has been generated.');
      } 
    } catch (err) {
      console.error('Error during generateImage call in component:', err);
      logoAnimation.stop();
      if (!useGenerationStore.getState().error) {
        const errorMessage = 'Failed to generate cartoon. Please try again.';
        setLocalError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    }
  };
  
  const flipY = logoAnimation.spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        <Animated.Image 
          source={require('@/assets/images/logo.png')} 
          style={[
            styles.logo,
            { 
              transform: [
                { perspective: 1000 }, 
                { rotateY: flipY }     
              ] 
            }
          ]} 
        />
        <CreateCard 
          error={localError}
          selectedImage={selectedImage}
          isLoading={isLoading}
          onPickImage={pickImage}
          onGenerate={handleGenerate}
          variants={VARIANT_OPTIONS}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          onDismissImage={handleDismissImage}
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