import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGenerationStore } from '../../stores/generation';
import { ArrowLeft } from 'lucide-react-native';

export default function HistoryScreen() {
  const router = useRouter();
  const { generations, fetchHistory, isLoading } = useGenerationStore();

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cartoons</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : generations.length === 0 ? (
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.originalImageUrl }}
                  style={styles.image}
                />
                <Image
                  source={{ uri: item.generatedImageUrl }}
                  style={styles.image}
                />
              </View>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
}); 