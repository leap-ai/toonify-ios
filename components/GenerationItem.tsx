import React, { useState } from 'react';
import { View, StyleSheet, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Text, Spinner, Stack, Button, Card, XStack } from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { formatRelativeDate } from '@/utils/dateUtils';

export interface Generation {
  id: number;
  originalImageUrl: string;
  cartoonImageUrl: string;
  createdAt: string;
}

interface GenerationItemProps {
  item: Generation;
}

const GenerationItem: React.FC<GenerationItemProps> = ({ item }) => {
  const router = useRouter();
  const [originalImageLoaded, setOriginalImageLoaded] = useState(false);
  const [cartoonImageLoaded, setCartoonImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();

  return (
    <Card 
      marginVertical="$2" 
      bordered 
      elevate
      backgroundColor={theme.card}
      borderColor={theme.cardBorder}
    >
      <Card.Header paddingVertical="$2" paddingHorizontal="$3">
        <Text color={theme.text.secondary} fontSize="$2">{formatRelativeDate(item.createdAt)}</Text>
      </Card.Header>
      <XStack padding="$3" justifyContent="space-around">
        <Stack 
          onPress={() => setSelectedImage(item.originalImageUrl)} 
          style={styles.imageWrapper}
        >
          {!originalImageLoaded && (
            <View style={styles.loaderContainer}>
              <Spinner size="small" color={theme.tint} />
            </View>
          )}
          <View style={{ opacity: originalImageLoaded && cartoonImageLoaded ? 1 : 0.3 }}>
            <Image 
              source={{ uri: item.originalImageUrl }} 
              style={styles.thumbnail}
              onLoad={() => setOriginalImageLoaded(true)}
            />
          </View>
        </Stack>
        <Stack 
          onPress={() => setSelectedImage(item.cartoonImageUrl)}
          style={styles.imageWrapper}
        >
          {!cartoonImageLoaded && (
            <View style={styles.loaderContainer}>
              <Spinner size="small" color={theme.tint} />
            </View>
          )}
          <View style={{ opacity: originalImageLoaded && cartoonImageLoaded ? 1 : 0.3 }}>
            <Image 
              source={{ uri: item.cartoonImageUrl }} 
              style={styles.thumbnail}
              onLoad={() => setCartoonImageLoaded(true)}
            />
          </View>
        </Stack>
      </XStack>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.9)' }]}>
          <Button 
            icon={<X size={24} color="#fff" />}
            onPress={() => setSelectedImage(null)}
            backgroundColor="rgba(30, 30, 30, 0.7)"
            position="absolute"
            top={40}
            right={20}
            zIndex={1}
            circular
          />
          <Image 
            source={{ uri: selectedImage || '' }} 
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </Card>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  loaderContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '90%',
  },
});

export default GenerationItem; 