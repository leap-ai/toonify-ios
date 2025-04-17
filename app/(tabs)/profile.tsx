import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth';
import { router } from 'expo-router';

// Dummy user data
const DUMMY_USER = {
  name: "John Doe",
  email: "john@example.com",
  joinedDate: "2024-01-01"
};

const DUMMY_GENERATIONS = [
  {
    id: '1',
    created_at: '2024-04-15T10:00:00Z',
    original_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    cartoon_image: 'https://v3.fal.media/files/kangaroo/BBaHWx09TiVHI7-uo6yI8_27a0c5437b7d4cd19ac0540d90092ead.png'
  },
  {
    id: '2',
    created_at: '2024-04-14T15:30:00Z',
    original_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    cartoon_image: 'https://v3.fal.media/files/kangaroo/BBaHWx09TiVHI7-uo6yI8_27a0c5437b7d4cd19ac0540d90092ead.png'
  }
];

interface Generation {
  id: string;
  created_at: string;
  original_image: string;
  cartoon_image: string;
}

export default function ProfileScreen() {
  const [generations] = useState<Generation[]>(DUMMY_GENERATIONS);
  const { signOut } = useAuthStore();

  const handleLogout = () => {
    signOut();
    router.replace('/(auth)/login');
  };

  const renderGenerationItem = ({ item }: { item: Generation }) => (
    <View style={styles.generationItem}>
      <Text style={styles.dateText}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
      <View style={styles.imagesContainer}>
        <Image source={{ uri: item.original_image }} style={styles.thumbnail} />
        <Image source={{ uri: item.cartoon_image }} style={styles.thumbnail} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userHeader}>
          <View>
            <Text style={styles.userName}>{DUMMY_USER.name}</Text>
            <Text style={styles.userEmail}>{DUMMY_USER.email}</Text>
            <Text style={styles.joinDate}>Joined: {new Date(DUMMY_USER.joinedDate).toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Generation History</Text>
      <FlatList
        data={generations}
        renderItem={renderGenerationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
  joinDate: {
    fontSize: 14,
    color: '#888',
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  generationItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  listContent: {
    paddingBottom: 20,
  },
});