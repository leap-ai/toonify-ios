import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Upload } from 'lucide-react-native';

const DUMMY_CARTOON_IMAGE = 'https://v3.fal.media/files/kangaroo/BBaHWx09TiVHI7-uo6yI8_27a0c5437b7d4cd19ac0540d90092ead.png';

export default function CartoonifyScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [cartoonImage, setCartoonImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      simulateCartoonify();
    }
  };

  const simulateCartoonify = async () => {
    setLoading(true);
    // Simulate API call with a 3-second delay
    setTimeout(() => {
      setCartoonImage(DUMMY_CARTOON_IMAGE);
      setLoading(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Upload size={24} color="#fff" />
        <Text style={styles.uploadText}>Upload Image</Text>
      </TouchableOpacity>

      {image && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Original Image:</Text>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loaderText}>Cartoonifying your image...</Text>
        </View>
      )}

      {cartoonImage && !loading && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Cartoonified Image:</Text>
          <Image source={{ uri: cartoonImage }} style={styles.image} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  imageContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});