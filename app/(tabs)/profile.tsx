import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Modal, ActivityIndicator, Animated } from 'react-native';
import { useState, useEffect } from 'react';
import { LogOut, X, ChevronRight, Shield } from 'lucide-react-native';
import { authClient } from "../../stores/auth";
import { useGenerationStore, Generation } from '@/stores/generation';
import { useCredits } from '@/hooks/useCredits';
import { router } from 'expo-router';
import { CreditTransaction } from '@/types';

const GenerationItem = ({ item }: { item: Generation }) => {
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
      return `${diffHours} hours ago`;
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
    <TouchableOpacity 
      style={styles.generationItem}
      onPress={() => router.push('/history')}
    >
      <View style={styles.generationImages}>
        <View style={styles.imageWrapper}>
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
        </View>
        <View style={styles.imageWrapper}>
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
        </View>
      </View>
      <Text style={styles.dateText}>
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
    </TouchableOpacity>
  );
};

const CreditItem = ({ item }: { item: CreditTransaction }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.creditItem}>
      <View style={styles.creditInfo}>
        <Text style={styles.creditType}>{item.type || "test"}</Text>
        <Text style={styles.creditAmount}>
          {item.amount > 0 ? '+' : ''}{item.amount} credits
        </Text>
      </View>
      <Text style={styles.creditDate}>
        {formatDate(item.createdAt)}
      </Text>
    </View>
  );
};

const InfoItem = ({ title, value, onPress }: { title: string; value?: string; onPress?: () => void }) => (
  <TouchableOpacity 
    style={styles.infoItem} 
    onPress={onPress}
    disabled={!onPress}
  >
    <Text style={styles.infoTitle}>{title}</Text>
    <View style={styles.infoValueContainer}>
      {value && <Text style={styles.infoValue}>{value}</Text>}
      {onPress && <ChevronRight size={20} color="#666" />}
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();

  const { generations, isLoading, error, fetchGenerations } = useGenerationStore();
  const { history: creditHistory, isLoading: isCreditsLoading, creditsBalance } = useCredits();

  useEffect(() => {
    if (session?.user.id) {
      fetchGenerations();
    }
  }, [session?.user?.id]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const recentGenerations = generations.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userHeader}>
          <View>
            <Text style={styles.userName}>{session?.user?.name}</Text>
            <Text style={styles.userEmail}>{session?.user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <InfoItem title="Available Credits" value={`${creditsBalance} credits`} />
          <InfoItem title="Total Generations" value={generations.length.toString()} />
          <InfoItem 
            title="Privacy Policy" 
            onPress={() => router.push('/privacy-policy')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Recent Generations</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <FlatList
          data={recentGenerations}
          renderItem={({ item }) => <GenerationItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
        {generations.length > 5 && (
          <TouchableOpacity 
            style={styles.showMoreButton}
            onPress={() => router.push('/history')}
          >
            <Text style={styles.showMoreText}>Show More</Text>
            <ChevronRight size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Credit Transactions</Text>
        {isCreditsLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : creditHistory.length === 0 ? (
          <Text style={styles.emptyText}>No credit transactions yet</Text>
        ) : (
          <FlatList
            data={creditHistory}
            renderItem={({ item }) => <CreditItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userInfoContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoTitle: {
    fontSize: 16,
    color: '#333',
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 10,
  },
  generationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  generationImages: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 10,
  },
  imageWrapper: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 'auto',
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
  creditItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  creditInfo: {
    flex: 1,
  },
  creditType: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  creditAmount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  creditDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 8,
  },
  showMoreText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});