import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageSourcePropType, ScrollView as RNScrollView } from 'react-native';
import { Card, H3, Text, YStack, Button, Spinner, XStack, ToggleGroup, SizableText, ScrollView } from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { APP_DISCLAIMER } from '@/utils/constants';
import { Zap, X as XIcon, Info } from '@tamagui/lucide-icons';
import { ImageVariantFrontend, VARIANT_OPTIONS } from '@/app/(tabs)/index';

// Define the type for a single variant option based on VARIANT_OPTIONS structure
type VariantOption = typeof VARIANT_OPTIONS[number];

// Define best practices data structure
const BEST_PRACTICES: Record<ImageVariantFrontend, string[]> = {
  pixar: [
    "Clear, well-lit portrait or upper body shots work best.",
    "Avoid very busy backgrounds for optimal focus on the subject.",
    "1-2 people maximum for best character detail."
  ],
  ghiblix: [
    "Scenic shots or expressive character faces are great.",
    "Softer lighting enhances the Ghibli feel.",
    "Ensure good contrast in the image."
  ],
  sticker: [
    "Clear subject, preferably a face or a distinct object.",
    "Simpler backgrounds help the sticker 'pop'.",
    "Good for solo subjects."
  ],
  plushy: [
    "Works well with animals, characters, or even people.",
    "Good lighting helps define the 'plush' texture.",
    "Avoid overly complex details that might get lost."
  ],
};

export interface CreateCardProps {
  error: string | null;
  selectedImage: string | null;
  isLoading: boolean;
  onPickImage: () => Promise<void>;
  onGenerate: () => Promise<void>;
  variants: typeof VARIANT_OPTIONS;
  selectedVariant: ImageVariantFrontend;
  onVariantChange: (value: ImageVariantFrontend) => void;
  onDismissImage?: () => void;
}

export default function CreateCard({
  error,
  selectedImage,
  isLoading,
  onPickImage,
  onGenerate,
  variants,
  selectedVariant,
  onVariantChange,
  onDismissImage,
}: CreateCardProps) {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const currentTips = BEST_PRACTICES[selectedVariant] || [];

  return (
    <Card 
      elevate
      size="$4" 
      bordered
      style={[
        styles.card, 
        { backgroundColor: theme.card }
      ]}
    >
      {/* Dismiss button positioned relative to the Card, if image selected */}
      {selectedImage && onDismissImage && (
        <TouchableOpacity 
          style={styles.dismissButtonCard}
          onPress={onDismissImage}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <XIcon size={24} color={theme.text.secondary} />
        </TouchableOpacity>
      )}

      <Card.Header padded alignItems="center" style={styles.cardHeader}>
        <H3 fontWeight="bold" style={{ color: theme.text.primary }}>Turn into Toon!</H3>
      </Card.Header>
      <YStack space="$2">
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <TouchableOpacity 
              style={[
                styles.uploadBox, 
                { 
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder 
                }
              ]}
              onPress={onPickImage}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.uploadText,
                  { color: theme.text.secondary }
                ]}
              >
                Tap to select an image
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Variant Selection UI */}
        <YStack space="$3" marginBottom="$3" paddingHorizontal="$3">
          {error ? (
            <Text style={[styles.errorText, { color: theme.text.error }]}>
              {error}
            </Text>
          ) : null}
          <SizableText size="$6" color={theme.text.primary} fontWeight="bold" textAlign="center">Select Style</SizableText>
          <RNScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toggleGroupContainer}
          >
            <ToggleGroup 
              type="single" 
              value={selectedVariant} 
              onValueChange={(val) => {
                if (val) onVariantChange(val as ImageVariantFrontend);
              }}
              orientation="horizontal"
              size="$4.5"
              bw={1}
              bc={theme.card}
              disablePassBorderRadius
              gap="$2.5"
            >
              {variants.map((variant: VariantOption) => (
                <ToggleGroup.Item 
                  key={variant.value} 
                  value={variant.value} 
                  backgroundColor={selectedVariant === variant.value ? theme.button.primary.background : '$backgroundTransparent'}
                  hoverStyle={{
                    backgroundColor: selectedVariant === variant.value ? theme.button.primary.hoverBackground : '$backgroundHover',
                  }}
                  pressStyle={{
                    backgroundColor: selectedVariant === variant.value ? theme.button.primary.pressBackground : '$backgroundPress',
                  }}
                  paddingVertical="$3"
                  paddingHorizontal="$3"
                  minWidth={120}
                  borderRadius={"$4"}
                >
                  <YStack alignItems="center" space="$2.5">
                    <Image 
                      source={variant.image as ImageSourcePropType}
                      style={[
                          styles.variantImage,
                          selectedVariant === variant.value && { borderColor: theme.tint, borderWidth: 2 }
                      ]} 
                    />
                    <Text 
                      color={selectedVariant === variant.value ? theme.button.primary.text : theme.text.secondary}
                      fontSize="$3"
                      fontWeight={selectedVariant === variant.value ? "bold" : "500"}
                      textAlign="center"
                    >
                      {variant.label}
                    </Text>
                  </YStack>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup>
          </RNScrollView>
        </YStack>
        
        <YStack space="$2" paddingHorizontal="$3">
          <Button
            size="$4"
            backgroundColor={theme.button.primary.background}
            color={theme.button.primary.text}
            hoverStyle={{ backgroundColor: theme.button.primary.hoverBackground }}
            pressStyle={{ backgroundColor: theme.button.primary.pressBackground }}
            onPress={onGenerate}
            style={styles.button}
            disabled={!selectedImage || isLoading}
            icon={isLoading ? <Spinner color={theme.button.primary.text} /> : <Zap size={18} color={theme.button.primary.text} />}
          >
            <Text style={{ color: 'white' }}>Generate</Text>
          </Button>
          
          {/* Best Practices Section */}
          {currentTips.length > 0 && (
            <YStack 
              space="$2" 
              marginTop="$4" 
              padding="$3" 
              borderRadius="$3" 
              backgroundColor="$backgroundFocus"
              borderColor={theme.cardBorder}
              borderWidth={1}
            >
              <XStack alignItems="center" space="$2">
                <Info size={16} color={theme.text.secondary} />
                <SizableText size="$5" fontWeight="bold" color={theme.text.primary}>Tips for Best Results:</SizableText>
              </XStack>
              {currentTips.map((tip, index) => (
                <Text key={index} fontSize="$3" color={theme.text.secondary} marginLeft="$2">
                  • {tip}
                </Text>
              ))}
            </YStack>
          )}
          <Text 
            fontSize="$2" 
            color={theme.text.warning} 
            textAlign="left" 
            marginTop="$2"
            paddingHorizontal="$1"
          >
            {APP_DISCLAIMER}
          </Text>
        </YStack>
      </YStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    position: 'relative',
  },
  cardHeader: {
    // zIndex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadBox: {
    width: 200,
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  dismissButtonCard: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 8,
    zIndex: 20,
  },
  variantImage: {
    width: 100, 
    height: 100, 
    borderRadius: 6,
  },
  toggleGroupContainer: {
    paddingHorizontal: 1,
  },
  button: {
    height: 50,
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 10,
    textAlign: 'center',
  }
}); 