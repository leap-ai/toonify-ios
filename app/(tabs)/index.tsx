import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, Animated } from 'react-native';
import { useAppTheme } from '@/context/ThemeProvider';
import { useGenerationStore } from '@/stores/generation';
import CreateCard from '@/components/CreateCard';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useLogoSpinAnimation } from '@/hooks/useLogoSpin';

// Define frontend variant type and options
export type ImageVariantFrontend = 'pixar' | 'ghiblix' | 'sticker' | 'plushy';

export const VARIANT_OPTIONS: { label: string; value: ImageVariantFrontend; image: any }[] = [
  { label: 'Ghibli', value: 'ghiblix', image: require('@/assets/images/ghiblix.png') },
  { label: 'Sticker', value: 'sticker', image: require('@/assets/images/sticker.png') },
  { label: 'Pixar', value: 'pixar', image: require('@/assets/images/pixar.png') },
  { label: 'Plushy', value: 'plushy', image: require('@/assets/images/plushy.png') },
];

export default function GenerateScreen() {
  const router = useRouter();
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const { generateImage, isLoading } = useGenerationStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ImageVariantFrontend>(VARIANT_OPTIONS[0].value);
  
  const logoAnimation = useLogoSpinAnimation(2000, false);
  
  useEffect(() => {
    if (!isLoading) {
      logoAnimation.stop();
      // Keep selectedImage as is, user might want to re-generate with different style
      // setSelectedImage(null); 
    }
  }, [isLoading]);

  const handleDismissImage = () => {
    setSelectedImage(null);
    setLocalError(null); // Also clear any local error related to image picking/validation
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

    try {
      // Start the logo spin animation
      logoAnimation.start();
      
      // Pass selectedVariant to generateImage
      await generateImage(selectedImage, selectedVariant);
      router.push('/(tabs)/history');
    } catch (err) {
      // Stop the animation if there's an error
      logoAnimation.stop();
      
      console.error('Error generating image:', err);
      const errorMessage = 'Failed to generate cartoon. Please try again.';
      setLocalError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };
  
  // Create a Y-axis (3D flip) interpolation
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
                { perspective: 1000 }, // Add perspective for 3D effect
                { rotateY: flipY }     // Rotate around Y-axis for flipping effect
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