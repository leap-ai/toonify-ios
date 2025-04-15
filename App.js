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
  ScrollView
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

const Stack = createNativeStackNavigator();

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

export default function App() {
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [cartoonUrl, setCartoonUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState(null);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
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

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true 
      });
      
      if (!result.canceled) {
        setImage(result.assets[0]);
        setError(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to pick image. Please try again.');
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.post(`${API_URL}/auth/login`, { username: 'demo' });
      await SecureStore.setItemAsync('token', res.data.token);
      setIsLoggedIn(true);
      fetchHistory();
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generate = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = await SecureStore.getItemAsync('token');
      
      if (!token) {
        setError('Please login first');
        setIsLoading(false);
        return;
      }
      
      const res = await axios.post(
        `${API_URL}/generation/generate`,
        { imageBase64: image.base64 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCurrentGeneration(res.data.generationId);
      pollStatus(res.data.generationId);
    } catch (error) {
      console.error('Generation error:', error);
      setError('Failed to generate cartoon. Please try again.');
      setIsLoading(false);
    }
  };

  const pollStatus = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      let attempts = 0;
      const maxAttempts = 10; // 20 seconds maximum (10 * 2000ms)
      
      const interval = setInterval(async () => {
        try {
          attempts++;
          console.log(`Polling attempt ${attempts} for generation ${id}`);
          
          const res = await axios.get(`${API_URL}/generation/check-status/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          console.log('Poll response:', res.data);
          
          if (res.data && res.data.status === 'complete') {
            console.log('Generation complete, setting cartoon URL:', res.data.cartoonUrl);
            setCartoonUrl(res.data.cartoonUrl);
            clearInterval(interval);
            fetchHistory();
            setIsLoading(false);
          } else if (res.data && res.data.status === 'failed') {
            console.log('Generation failed');
            setError('Generation failed. Please try again.');
            clearInterval(interval);
            setIsLoading(false);
          } else if (res.data && res.data.status === 'not_found') {
            console.log('Generation not found');
            setError('Generation not found. Please try again.');
            clearInterval(interval);
            setIsLoading(false);
          } else if (attempts >= maxAttempts) {
            console.log('Max polling attempts reached');
            setError('Generation timed out. Please try again.');
            clearInterval(interval);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Polling error:', error);
          clearInterval(interval);
          setError('Failed to check generation status.');
          setIsLoading(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Polling setup error:', error);
      setError('Failed to start polling for status.');
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) return;
      
      const res = await axios.get(`${API_URL}/generation/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (error) {
      console.error('History fetch error:', error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setIsLoggedIn(false);
      setHistory([]);
      setCartoonUrl(null);
      setCurrentGeneration(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => {
        if (item.status === 'complete') {
          setCartoonUrl(item.cartoonUrl);
        }
      }}
    >
      <View style={styles.historyItemContent}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.historyThumbnail} 
        />
        <View style={styles.historyTextContainer}>
          <Text style={styles.historyStatus}>
            {item.status === 'complete' ? 'Completed' : 
             item.status === 'processing' ? 'Processing' : 
             'Failed'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5'
  },
  scrollContent: { 
    padding: 20, 
    paddingTop: 40
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  loginContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  loginText: {
    fontSize: 16,
    marginBottom: 10
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500'
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  preview: { 
    width: 200, 
    height: 200, 
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16
  },
  cartoonContainer: {
    marginVertical: 20
  },
  cartoonTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10
  },
  cartoonImage: { 
    width: '100%', 
    height: 300, 
    borderRadius: 10,
    backgroundColor: '#ddd'
  },
  historyContainer: {
    marginTop: 20
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  historyThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5
  },
  historyTextContainer: {
    flex: 1,
    marginLeft: 10
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '500'
  }
});
