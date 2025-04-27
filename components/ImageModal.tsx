import React, { useState } from 'react';
import { View, Image, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Button, Spinner } from 'tamagui';
import { X } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeProvider';

interface ImageModalProps {
  imageUrl: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export const ImageModal = ({ imageUrl, isVisible, onClose }: ImageModalProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  
  // Reset loading state when modal becomes visible or image changes
  React.useEffect(() => {
    if (isVisible) {
      setImageLoading(true);
    }
  }, [isVisible, imageUrl]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalContainer, { backgroundColor: theme.overlayBackground }]}>
          <Button 
            icon={<X size={24} color={theme.text.primary} />}
            onPress={onClose}
            backgroundColor="$backgroundStrong"
            position="absolute"
            top={40}
            right={20}
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
    width: '95%',
    height: '95%',
  },
}); 