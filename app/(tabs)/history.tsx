import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGenerationStore } from '../../stores/generation';
import { ArrowLeft, X } from 'lucide-react-native';

interface Generation {
  id: number;
  originalImageUrl: string;
  cartoonImageUrl: string;
  createdAt: string;
}

const GenerationItem = ({ item }: { item: Generation }) => {
  const router = useRouter();
  const [originalImageLoaded, setOriginalImageLoaded] = useState(false);
  const [cartoonImageLoaded, setCartoonImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (originalImageLoaded && cartoonImageLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [originalImageLoaded, cartoonImageLoaded]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) {
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} ${diffHours === 1 && "hour" || "hours"} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <View style={styles.generationItem}>
      <View style={styles.imagesContainer}>
        <TouchableOpacity 
          style={styles.imageWrapper}
          onPress={() => setSelectedImage(item.originalImageUrl)}
        >
          {!originalImageLoaded && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          )}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Image 
              source={{ uri: item.originalImageUrl }} 
              style={styles.thumbnail}
              onLoad={() => setOriginalImageLoaded(true)}
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.imageWrapper}
          onPress={() => setSelectedImage(item.cartoonImageUrl)}
        >
          {!cartoonImageLoaded && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          )}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Image 
              source={{ uri: item.cartoonImageUrl }} 
              style={styles.thumbnail}
              onLoad={() => setCartoonImageLoaded(true)}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <Text style={styles.generationDate}>
        {formatDate(item.createdAt)}
      </Text>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
          <Image 
            source={{ uri: selectedImage || '' }} 
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

export default function HistoryScreen() {
  const router = useRouter();
  const { generations, fetchGenerations, isLoading: isGenerationsLoading } = useGenerationStore();

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  if (isGenerationsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Cartoons</Text>
          {generations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No cartoons generated yet</Text>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.generateButtonText}>Generate Your First Cartoon</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={generations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <GenerationItem item={item} />}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  generationItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageWrapper: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  generationDate: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
}); 