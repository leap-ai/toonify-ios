import React, { useState } from 'react';
import { View, StyleSheet, Image, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Text, XStack, Button, YStack, Spinner } from 'tamagui';
import { X, Download, Share2, Trash2 } from 'lucide-react-native';
import { Generation } from './GenerationItem';
import { formatRelativeDate } from '@/utils/dateUtils';
import { useAppTheme } from '@/context/ThemeProvider';
import { ImageModal } from './ImageModal';

interface ImageDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  item: Generation | null;
}

const { width, height } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.42; // Adjusted for better visibility
const MIN_MODAL_HEIGHT = height * 0.4; // Minimum 40% of screen height

export const ImageDetailsModal = ({ isVisible, onClose, item }: ImageDetailsModalProps) => {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [originalImageLoaded, setOriginalImageLoaded] = useState(false);
  const [cartoonImageLoaded, setCartoonImageLoaded] = useState(false);

  // Reset loading states when modal opens with new item
  React.useEffect(() => {
    if (isVisible) {
      setOriginalImageLoaded(false);
      setCartoonImageLoaded(false);
    }
  }, [isVisible, item]);

  if (!item) return null;

  const handleImagePress = (imageUrl: string) => {
    // Set the full screen image and prevent event propagation
    setFullScreenImage(imageUrl);
  };

  // Handle the modal close
  const handleFullScreenClose = () => {
    setFullScreenImage(null);
  };

  return (
    <>
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
          <View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: theme.background,
                minHeight: MIN_MODAL_HEIGHT
              }
            ]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={theme.text.primary} />
            </TouchableOpacity>

            <XStack justifyContent="space-between" padding="$2" marginTop="$2" flex={1}>
              <YStack alignItems="center" space="$2" flex={1}>
                <Text color={theme.text.secondary} fontSize="$3" fontWeight="500">Original</Text>
                <TouchableOpacity 
                  style={[styles.imageContainer, { borderColor: theme.cardBorder }]}
                  onPress={() => handleImagePress(item.originalImageUrl)}
                  activeOpacity={0.8}
                >
                  {!originalImageLoaded && (
                    <View style={styles.spinnerContainer}>
                      <Spinner size="large" color={theme.tint} />
                    </View>
                  )}
                  <Image 
                    source={{ uri: item.originalImageUrl }} 
                    style={[styles.image, { opacity: originalImageLoaded ? 1 : 0 }]}
                    resizeMode="cover"
                    onLoad={() => setOriginalImageLoaded(true)}
                  />
                </TouchableOpacity>
              </YStack>
              
              <YStack alignItems="center" space="$2" flex={1}>
                <Text color={theme.text.secondary} fontSize="$3" fontWeight="500">Cartoon</Text>
                <TouchableOpacity 
                  style={[styles.imageContainer, { borderColor: theme.cardBorder }]}
                  onPress={() => handleImagePress(item.cartoonImageUrl)}
                  activeOpacity={0.8}
                >
                  {!cartoonImageLoaded && (
                    <View style={styles.spinnerContainer}>
                      <Spinner size="large" color={theme.tint} />
                    </View>
                  )}
                  <Image 
                    source={{ uri: item.cartoonImageUrl }} 
                    style={[styles.image, { opacity: cartoonImageLoaded ? 1 : 0 }]}
                    resizeMode="cover"
                    onLoad={() => setCartoonImageLoaded(true)}
                  />
                </TouchableOpacity>
              </YStack>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center" marginVertical="$4" paddingHorizontal="$2">
              <Text color={theme.text.secondary} fontSize="$3">
                {formatRelativeDate(item.createdAt)}
              </Text>
              
              <XStack space="$3">
                <Button
                  size="$3"
                  circular
                  chromeless
                  onPress={() => {}}
                  icon={<Download size={22} color={theme.text.primary} />}
                />
                <Button
                  size="$3"
                  circular
                  chromeless
                  onPress={() => {}}
                  icon={<Share2 size={22} color={theme.text.primary} />}
                />
                <Button
                  size="$3"
                  circular
                  chromeless
                  onPress={() => {}}
                  icon={<Trash2 size={22} color={theme.text.primary} />}
                />
              </XStack>
            </XStack>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Full screen image modal */}
      <ImageModal
        imageUrl={fullScreenImage}
        isVisible={!!fullScreenImage}
        onClose={handleFullScreenClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 35,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  }
}); 