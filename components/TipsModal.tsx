import React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, SizableText, Button } from 'tamagui';
import { Info, X } from '@tamagui/lucide-icons';
import { useAppTheme } from '@/context/ThemeProvider';
import { BEST_PRACTICES, APP_DISCLAIMER } from '@/utils/constants';
import { ImageVariantFrontend } from '@/utils/types';
import { VARIANT_OPTIONS } from '@/utils/constants';

interface TipsModalProps {
  isVisible: boolean;
  onClose: () => void;
  variant: ImageVariantFrontend;
}

export default function TipsModal({ isVisible, onClose, variant }: TipsModalProps) {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const currentTips = BEST_PRACTICES[variant] || [];
  const variantName = VARIANT_OPTIONS.find(v => v.value === variant)?.label;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <YStack 
          style={[
            styles.modalContent,
            { backgroundColor: theme.card }
          ]}
          space="$4"
          padding="$4"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack space="$2" alignItems="center">
              <Info size={20} color={theme.text.primary} />
              <SizableText size="$6" fontWeight="bold" color={theme.text.primary}>
                Tips for {variantName} style!
              </SizableText>
            </XStack>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={24} color={theme.text.secondary} />
            </TouchableOpacity>
          </XStack>

          <YStack space="$3">
            {currentTips.map((tip, index) => (
              <XStack key={index} space="$2" alignItems="flex-start">
                <Text color={theme.text.primary} fontSize="$4">•</Text>
                <Text color={theme.text.primary} fontSize="$3" flex={1}>
                  {tip}
                </Text>
              </XStack>
            ))}
          </YStack>

          <YStack 
            space="$2" 
            padding="$3" 
            borderRadius="$3" 
            backgroundColor="$backgroundFocus"
            borderColor={theme.cardBorder}
            borderWidth={1}
          >
            <Text 
              fontSize="$3" 
              color={theme.text.warning} 
              textAlign="left"
            >
              {APP_DISCLAIMER}
            </Text>
          </YStack>

          <Button
            size="$4"
            backgroundColor={theme.button.primary.background}
            color={theme.button.primary.text}
            onPress={onClose}
          >
            <Text fontSize="$4" fontWeight="bold" color={theme.button.primary.text}>
              Got it
            </Text>
          </Button>
        </YStack>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
}); 