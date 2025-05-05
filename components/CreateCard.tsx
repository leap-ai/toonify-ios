import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, H3, Text, YStack, Button, Spinner } from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { APP_DISCLAIMER } from '@/utils/constants';
import { Zap } from '@tamagui/lucide-icons';

export interface CreateCardProps {
  error: string | null;
  selectedImage: string | null;
  isLoading: boolean;
  onPickImage: () => Promise<void>;
  onGenerate: () => Promise<void>;
}

export default function CreateCard({
  error,
  selectedImage,
  isLoading,
  onPickImage,
  onGenerate,
}: CreateCardProps) {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();

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
      <Card.Header padded alignItems="center">
        <H3 fontWeight="bold" style={{ color: theme.text.primary }}>Turn into Toon!</H3>
      </Card.Header>
      <YStack space="$2" p="$3">
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
              {/* <FA name="upload" size={100} color={theme.text.secondary} /> */}
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
        
        <YStack space="$2">
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
            <Text style={{ color: 'white' }}>Generate Cartoon</Text>
          </Button>
          
          <Text 
            fontSize="$2" 
            color={theme.text.warning} 
            textAlign="left" 
            marginTop="$2"
          >
            {APP_DISCLAIMER}
          </Text>
          
          {error ? (
            <Text style={[styles.errorText, { color: theme.text.error }]}>
              {error}
            </Text>
          ) : null}
        </YStack>
      </YStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadBox: {
    width: 300,
    height: 300,
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
  button: {
    height: 50,
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 10,
    textAlign: 'center',
  }
}); 