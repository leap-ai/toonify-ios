import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useGenerationStore } from '../../stores/generation';

export default function GenerateScreen() {
  const router = useRouter();
  const { generateImage, isLoading, error } = useGenerationStore();
  const [localError, setLocalError] = useState<string | null>(null);

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
        await generateImage(result.assets[0].uri);
        router.push('/(tabs)/history');
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setLocalError('Failed to pick image. Please try again.');
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Your Cartoon</Text>
        <Text style={styles.subtitle}>Upload a photo to transform it into a cartoon</Text>
        
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImage}
          disabled={isLoading}
        >
          <Text style={styles.uploadButtonText}>
            {isLoading ? 'Processing...' : 'Upload Photo'}
          </Text>
        </TouchableOpacity>
        
        {(error || localError) && (
          <Text style={styles.errorText}>{error || localError}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    marginTop: 20,
    textAlign: 'center',
  },
});