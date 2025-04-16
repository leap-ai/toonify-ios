import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  Image, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageSourcePropType
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './auth/AuthContext';
import SignInScreen from './auth/SignInScreen';
import SignUpScreen from './auth/SignUpScreen';
import { API_URL } from '@env';

// Define types
interface HistoryItem {
  id: string;
  originalImage: string;
  cartoonImage: string;
  createdAt: string;
}

interface GenerationStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: string;
  error?: string;
}

// Create navigator
const Stack = createNativeStackNavigator();

// Navigation component
function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        // Add your authenticated screens here
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        // Auth screens
        <>
          <Stack.Screen 
            name="SignIn" 
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

// Placeholder HomeScreen component
function HomeScreen() {
  const { signOut } = useAuth();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the app!</Text>
      <TouchableOpacity onPress={signOut}>
        <Text style={{ color: '#007AFF', marginTop: 20 }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// Main App component
export function App() {
  const [image, setImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cartoonUrl, setCartoonUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentGeneration, setCurrentGeneration] = useState<GenerationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setIsLoggedIn(true);
        fetchHistory();
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const login = async (): Promise<void> => {
    try {
      // This would be replaced with your actual login logic
      await SecureStore.setItemAsync('token', 'dummy-token');
      setIsLoggedIn(true);
      fetchHistory();
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to log in');
    }
  };

  const generate = async (): Promise<void> => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      const response = await axios.post(`${API_URL}/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { id } = response.data;
      setCurrentGeneration({ id, status: 'pending' });
      pollStatus(id);
    } catch (error: any) {
      console.error('Error generating cartoon:', error);
      setError(error.response?.data?.error || 'Failed to generate cartoon');
      setIsLoading(false);
    }
  };

  const pollStatus = async (id: string): Promise<void> => {
    try {
      const response = await axios.get(`${API_URL}/status/${id}`);
      const { status, progress, result, error } = response.data;

      setCurrentGeneration({
        id,
        status,
        progress,
        result,
        error,
      });

      if (status === 'completed' && result) {
        setCartoonUrl(result);
        setIsLoading(false);
        fetchHistory();
      } else if (status === 'failed') {
        setError(error || 'Generation failed');
        setIsLoading(false);
      } else {
        // Continue polling
        setTimeout(() => pollStatus(id), 2000);
      }
    } catch (error) {
      console.error('Error polling status:', error);
      setError('Failed to check generation status');
      setIsLoading(false);
    }
  };

  const fetchHistory = async (): Promise<void> => {
    try {
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('token');
      setIsLoggedIn(false);
      setHistory([]);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <Image source={{ uri: item.originalImage }} style={styles.historyImage} />
      <Image source={{ uri: item.cartoonImage }} style={styles.historyImage} />
      <Text style={styles.historyDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  historyItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  historyDate: {
    alignSelf: 'center',
    color: '#666',
  },
}); 