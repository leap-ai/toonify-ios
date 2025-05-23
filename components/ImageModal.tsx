import React, { useState, useEffect } from 'react';
import { View, Image, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Button, Spinner } from 'tamagui';
import { X } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeProvider';
import { BlurView } from 'expo-blur';

interface ImageModalProps {
  imageUrl: string | null;
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const ImageModal = ({ imageUrl, isVisible, onClose, children }: ImageModalProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  
  // Reset loading state when modal becomes visible or image changes
  useEffect(() => {
    if (isVisible) {
      setImageLoading(true);
    }
  }, [isVisible, imageUrl]);

  if (!isVisible) return null;

  return (
    <Modal
      id="image-full-screen"
      visible={isVisible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalContainer, { backgroundColor: theme.overlayBackground }]}>
          <Button 
            icon={<X size={24} color={theme.text.primary} />}
            onPress={onClose}
            backgroundColor="transparent"
            pressStyle={{ backgroundColor: theme.button.secondary.pressBackground }}
            position="absolute"
            top="$2"
            right="$2"
            zIndex={1}
            circular
          />
          
          {imageLoading && (
            <View style={styles.spinnerContainer}>
              <Spinner size="large" color={theme.tint} />
            </View>
          )}
          
          {imageUrl && (
            <Image 
              source={{ uri: imageUrl }} 
              style={[
                styles.fullScreenImage,
                { opacity: imageLoading ? 0 : 1 }
              ]}
              resizeMode="contain"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  fullScreenImage: {
    width: 100,
    height: 100,
  },
}); 