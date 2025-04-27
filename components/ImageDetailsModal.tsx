import React, { useState } from 'react';
import { View, StyleSheet, Image, Modal, Dimensions, TouchableOpacity, Alert, Platform, Share } from 'react-native';
import { Text, XStack, Button, YStack, Spinner } from 'tamagui';
import { X, Download, Share2, Trash2 } from 'lucide-react-native';
import { Generation } from './GenerationItem';
import { formatRelativeDate } from '@/utils/dateUtils';
import { useAppTheme } from '@/context/ThemeProvider';
import { ImageModal } from './ImageModal';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useGenerationStore } from '@/stores/generation';
import Constants from 'expo-constants';

interface ImageDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  item: Generation | null;
}

const { width, height } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.42; // Adjusted for better visibility
const MIN_MODAL_HEIGHT = height * 0.4; // Minimum 40% of screen height
const isDev = Constants.appOwnership === 'expo' || __DEV__;

export const ImageDetailsModal = ({ isVisible, onClose, item }: ImageDetailsModalProps) => {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [originalImageLoaded, setOriginalImageLoaded] = useState(false);
  const [cartoonImageLoaded, setCartoonImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteGeneration } = useGenerationStore();

  // Reset loading states when modal opens with new item
  React.useEffect(() => {
    if (isVisible) {
      setOriginalImageLoaded(false);
      setCartoonImageLoaded(false);
    }
  }, [isVisible, item]);

  if (!item) return null;

  const handleImagePress = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
  };

  const handleFullScreenClose = () => {
    setFullScreenImage(null);
  };

  const saveToGallery = async (imageUrl: string) => {
    try {
      setIsDownloading(true);
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need permission to save images to your gallery.');
        setIsDownloading(false);
        return;
      }

      // Download image
      const fileUri = FileSystem.documentDirectory + `cartoon_${Date.now()}.jpg`;
      const downloadResponse = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (downloadResponse.status !== 200) {
        throw new Error('Failed to download image');
      }

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(downloadResponse.uri);
      
      Alert.alert('Success', 'Image saved to your photo gallery!');
      setIsDownloading(false);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image to gallery.');
      setIsDownloading(false);
    }
  };

  const shareImage = async (imageUrl: string) => {
    try {
      setIsSharing(true);
      
      // Download the image to a temporary file
      const fileUri = FileSystem.documentDirectory + `toonify_share_${Date.now()}.jpg`;
      const downloadResponse = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (downloadResponse.status !== 200) {
        throw new Error('Failed to download image for sharing');
      }

      // First try Expo Sharing 
      try {
        const isSharingAvailable = await Sharing.isAvailableAsync();
        
        if (isSharingAvailable) {
          // Use Expo Sharing if available
          await Sharing.shareAsync(downloadResponse.uri, {
            mimeType: 'image/jpeg',
            dialogTitle: 'Share Your Toonified Image',
            UTI: 'public.jpeg'
          });
        } else {
          // Fall back to React Native Share API
          await Share.share({
            url: Platform.OS === 'ios' ? downloadResponse.uri : `file://${downloadResponse.uri}`,
            title: 'Check out my cartoon image!',
            message: 'Created with Toonify AI'
          });
        }
      } catch (sharingError) {
        console.log('Expo sharing failed, trying React Native Share:', sharingError);
        
        // Fallback to React Native's Share API
        await Share.share({
          url: Platform.OS === 'ios' ? downloadResponse.uri : `file://${downloadResponse.uri}`,
          title: 'Check out my cartoon image!',
          message: 'Created with Toonify AI'
        });
      }
      
      setIsSharing(false);
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image.');
      setIsSharing(false);
    }
  };

  const handleDeleteGeneration = async () => {
    if (!item || !item.id) return;

    try {
      // Ask for confirmation
      Alert.alert(
        'Delete Generation',
        'Are you sure you want to delete this? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                setIsDeleting(true);
                
                // Call the deleteGeneration method from the store
                const success = await deleteGeneration(item.id);
                
                if (success) {
                  // Close the modal if deletion was successful
                  onClose();
                  Alert.alert('Success', 'Generation deleted successfully');
                } else {
                  Alert.alert('Error', 'Failed to delete generation.');
                }
              } catch (error) {
                console.error('Error in deletion process:', error);
                Alert.alert('Error', 'An unexpected error occurred.');
              } finally {
                setIsDeleting(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in delete alert:', error);
    }
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
          style={[styles.modalOverlay, { backgroundColor: theme.overlayBackground }]} 
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
                <Text color={theme.text.accent} fontSize="$3" fontWeight="500">Original</Text>
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
                <Text color={theme.text.accent} fontSize="$3" fontWeight="500">Cartoon</Text>
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
                  disabled={isDownloading}
                  onPress={() => saveToGallery(item.cartoonImageUrl)}
                  icon={isDownloading ? 
                    <Spinner color={theme.tint} size="small" /> : 
                    <Download size={22} color={theme.text.primary} />
                  }
                />
                <Button
                  size="$3"
                  circular
                  chromeless
                  disabled={isSharing}
                  onPress={() => shareImage(item.cartoonImageUrl)}
                  icon={isSharing ? 
                    <Spinner color={theme.tint} size="small" /> : 
                    <Share2 size={22} color={theme.text.primary} />
                  }
                />
                <Button
                  size="$3"
                  circular
                  chromeless
                  disabled={isDeleting}
                  onPress={handleDeleteGeneration}
                  icon={isDeleting ? 
                    <Spinner color={theme.text.error} size="small" /> : 
                    <Trash2 size={22} color={theme.text.error} />
                  }
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
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
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