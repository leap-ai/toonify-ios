import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, Animated, Platform } from 'react-native';
import { useAppTheme } from '@/context/ThemeProvider';
import { useSubscriptionStore } from '@/stores/subscription';
import { useGenerationStore } from '@/stores/generation';
import CreateCard from '@/components/CreateCard';
import TipsModal from '@/components/TipsModal';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect } from 'expo-router';
import { 
  registerForPushNotificationsAsync, 
  schedulePushNotification 
} from '@/utils/notifications';
import { useCredits } from '@/hooks/useCredits';
import { ImageVariantFrontend } from '@/utils/types';
import { ANALYTICS_EVENTS, VARIANT_OPTIONS } from '@/utils/constants';
import { usePostHog } from 'posthog-react-native';
import { Button, XStack } from 'tamagui';
import { Info } from '@tamagui/lucide-icons';

export default function GenerateScreen() {
  const posthog = usePostHog();
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
  const [isTipsModalVisible, setIsTipsModalVisible] = useState(false);
  
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
    const variantName = VARIANT_OPTIONS.find(v => v.value === selectedVariant)?.label;
    if (!selectedImage) {
      const errorMessage = 'Please select an image first.';
      setLocalError(errorMessage);
      Alert.alert('Error', errorMessage);
      return;
    }

    schedulePushNotification('Generation Started', `Your ${variantName} Cartoon is being created in the background.`);

    try {
      await generateImage(selectedImage, selectedVariant, isActiveProMember);
      const genError = useGenerationStore.getState().error;
      if (genError) {
        throw new Error(genError);
      }
      if (posthog) {
        posthog.capture(ANALYTICS_EVENTS.CARTOON_GENERATED, {
          cartoon_variant: selectedVariant,
        });
      }
      router.push('/(tabs)/history');
      schedulePushNotification('Toonified Picture Ready!', `Open app to see your new ${variantName} Cartoon.`);
      setSelectedImage(null);
      setLocalError(null);
    } catch (err) {
      console.error('Error during generateImage call in component:', err);
      if (!err) {
        const errorMessage = 'Failed to generate image. Please try again.';
        setLocalError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.screenBackground }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        <XStack 
          width="100%" 
          justifyContent="flex-end" 
          paddingHorizontal="$4" 
          paddingBottom="$2"
        >
          <Button
            size="$2"
            backgroundColor={theme.button.secondary.background}
            color={theme.button.secondary.text}
            fontWeight="400"
            onPress={() => setIsTipsModalVisible(true)}
            icon={<Info size={16} color={theme.button.secondary.text} />}
          >
            Tips
          </Button>
        </XStack>
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

      <TipsModal
        isVisible={isTipsModalVisible}
        onClose={() => setIsTipsModalVisible(false)}
        variant={selectedVariant}
      />
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