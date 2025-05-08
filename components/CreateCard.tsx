import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageSourcePropType, ScrollView as RNScrollView, Animated } from 'react-native';
import { Card, H3, Text, YStack, Button, Spinner, XStack, ToggleGroup, SizableText, ScrollView } from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { APP_DISCLAIMER } from '@/utils/constants';
import { Zap, X as XIcon, Info } from '@tamagui/lucide-icons';
import { ImageVariantFrontend, VARIANT_OPTIONS } from '@/app/(tabs)/index';

const selectedVariantLabel = (selectedVariant: ImageVariantFrontend) => VARIANT_OPTIONS.find(v => v.value === selectedVariant)?.label;

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
  variants: Array<{
    label: string;
    value: ImageVariantFrontend;
    image: any; // Or a more specific ImageSourcePropType if possible
    isPro: boolean;
  }>;
  selectedVariant: ImageVariantFrontend;
  onVariantChange: (value: ImageVariantFrontend) => void;
  onDismissImage?: () => void;
  isActiveProMember: boolean;
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
  isActiveProMember,
}: CreateCardProps) {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const currentTips = BEST_PRACTICES[selectedVariant] || [];

  // Animation setup
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.95,
              duration: 700,
              useNativeDriver: true, // Enable native driver for better performance
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.7,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      // Stop animation and reset values
      scaleAnim.stopAnimation(); // Stop the loop
      opacityAnim.stopAnimation();
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true })
      ]).start();
    }

    // Cleanup function to stop animation if component unmounts while isLoading
    return () => {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [isLoading, scaleAnim, opacityAnim]);

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
            <Animated.Image
              source={{ uri: selectedImage }}
              style={[
                styles.image,
                {
                  opacity: opacityAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            />
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
              bc={theme.card}
              disablePassBorderRadius
              gap="$2.5"
            >
              {variants.map((variant) => {
                // Determine if the variant is a Pro feature and if the user has access
                const isProFeature = variant.isPro;
                const userHasProAccess = isActiveProMember;
                const isDisabled = isProFeature && !userHasProAccess;

                return (
                  <ToggleGroup.Item 
                    key={variant.value} 
                    value={variant.value} 
                    disabled={isDisabled} // Disable if it's a Pro feature and user doesn't have access
                    backgroundColor={selectedVariant === variant.value ? theme.button.primary.background : '$backgroundTransparent'}
                    hoverStyle={{
                      backgroundColor: selectedVariant === variant.value 
                        ? theme.button.primary.hoverBackground 
                        : isDisabled ? '$backgroundTransparent' : '$backgroundHover',
                    }}
                    pressStyle={{
                      backgroundColor: selectedVariant === variant.value 
                        ? theme.button.primary.pressBackground 
                        : isDisabled ? '$backgroundTransparent' : '$backgroundPress',
                    }}
                    paddingVertical="$3"
                    paddingHorizontal="$3"
                    minWidth={120}
                    borderRadius={"$4"}
                    // Apply opacity if disabled
                    opacity={isDisabled ? 0.6 : 1} 
                    // The YStack now contains the image, text, and potentially the Pro badge
                  >
                    <YStack alignItems="center" space="$2.5" position="relative"> 
                      <Image 
                        source={variant.image as ImageSourcePropType}
                        style={[
                            styles.variantImage,
                            selectedVariant === variant.value && !isDisabled && { borderColor: theme.tint, borderWidth: 2 },
                            // Optionally, add a specific style for disabled images if needed beyond opacity
                        ]} 
                      />
                      <Text 
                        color={selectedVariant === variant.value && !isDisabled 
                                ? theme.button.primary.text 
                                : (isDisabled ? theme.text.secondary : theme.text.secondary) }
                        fontSize="$3"
                        fontWeight={selectedVariant === variant.value && !isDisabled ? "bold" : "500"}
                        textAlign="center"
                      >
                        {variant.label}
                      </Text>

                      {/* Pro Badge */}
                      {isDisabled && (
                        <View style={[
                          styles.proBadgeContainer,
                          { backgroundColor: theme.tint } // Use theme tint for badge background
                        ]}>
                          <Text style={styles.proBadgeText}>PRO</Text>
                        </View>
                      )}
                    </YStack>
                  </ToggleGroup.Item>
                );
              })}
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
                <SizableText size="$5" fontWeight="bold" color={theme.text.primary}>
                  Tips for Best Results with {selectedVariantLabel(selectedVariant)}:
                </SizableText>
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
    width: 80,
    height: 80,
    borderRadius: 10,
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
  },
  infoSection: { /* ... */ },
  tipsList: { /* ... */ },
  tipItem: { /* ... */ },
  proBadgeContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  proBadgeText: {
    color: 'white', // Assuming tint background is dark enough for white text
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 