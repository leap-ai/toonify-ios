import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { View, Text } from 'react-native';
import { API_URL } from '@env';
import { 
  AuthContextType, 
  User, 
  AuthProviderProps, 
  ErrorBoundaryProps, 
  ErrorBoundaryState 
} from './types';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Log the error to your preferred logging service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ color: 'red', fontSize: 16 }}>Something went wrong!</Text>
          <Text style={{ marginTop: 10 }}>{this.state.error?.toString()}</Text>
          <Text style={{ marginTop: 10 }}>{this.state.errorInfo?.componentStack}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userData = await SecureStore.getItemAsync('userData');
      if (token && userData) {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error: any) {
      throw error.response?.data?.error || 'An error occurred during sign in';
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<User> => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name
      });
      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error: any) {
      throw error.response?.data?.error || 'An error occurred during sign up';
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGoogleSignIn = async (idToken: string): Promise<User> => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        id_token: idToken
      });
      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error: any) {
      throw error.response?.data?.error || 'An error occurred during Google sign in';
    }
  };

  const handleAppleSignIn = async (identityToken: string): Promise<User> => {
    try {
      const response = await axios.post(`${API_URL}/auth/apple`, { identityToken });
      const { token: jwtToken, user } = response.data;
      await SecureStore.setItemAsync('userToken', jwtToken);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      setUser(user);
      return user;
    } catch (error: any) {
      throw error.response?.data?.error || 'An error occurred during Apple sign in';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        handleGoogleSignIn,
        handleAppleSignIn
      }}
    >
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 