import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config";

export const authClient = createAuthClient({
	baseURL: API_URL,
	disableDefaultFetchPlugins: true,
	plugins: [
		expoClient({
			scheme: "toonify",
      storagePrefix: "toonify",
			storage: SecureStore,
		}),
	],
});

// import { create } from 'zustand';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import * as AppleAuthentication from 'expo-apple-authentication';
// import axios from 'axios';
// import { API_URL, GOOGLE_CLIENT_ID, GOOGLE_EXPO_CLIENT_ID } from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { TOKEN_KEY, USER_KEY } from '@/config';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   credits: number;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
//   signInWithGoogle: () => Promise<void>;
//   signInWithApple: () => Promise<void>;
//   signOut: () => Promise<void>;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   signInWithEmail: (email: string, password: string) => Promise<void>;
//   initializeAuth: () => Promise<void>;
// }

// WebBrowser.maybeCompleteAuthSession();


// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: null,
//   isLoading: false,
//   error: null,
//   isAuthenticated: false,
  
//   initializeAuth: async () => {
//     try {
//       set({ isLoading: true });
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
//       const userStr = await AsyncStorage.getItem(USER_KEY);
      
//       if (token && userStr) {
//         const user = JSON.parse(userStr);
//         set({ 
//           token, 
//           user, 
//           isAuthenticated: true 
//         });
        
//         // Set up axios default headers
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.error('Failed to initialize auth:', error);
//     } finally {
//       set({ isLoading: false });
//     }
//   },
  
//   signInWithEmail: async (email: string, password: string) => {
//     try {
//       set({ isLoading: true, error: null });
//       const response = await axios.post(`${API_URL}/api/auth/login`, {
//         email,
//         password,
//       });
      
//       const { user, token } = response.data;
      
//       // Store token and user in AsyncStorage
//       await AsyncStorage.setItem(TOKEN_KEY, token);
//       await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      
//       // Set up axios default headers
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       set({
//         user,
//         token,
//         isAuthenticated: true,
//       });
      
//       // Use requestAnimationFrame for smooth transition
//       requestAnimationFrame(() => {
//         router.replace('/(tabs)');
//       });
//     } catch (error) {
//       set({ error: 'Failed to sign in' });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
  
//   signup: async (email: string, password: string, name: string) => {
//     try {
//       set({ isLoading: true, error: null });
//       const response = await axios.post(`${API_URL}/api/auth/signup`, {
//         email,
//         password,
//         name,
//       });
      
//       const { user, token } = response.data;
      
//       // Store token and user in AsyncStorage
//       await AsyncStorage.setItem(TOKEN_KEY, token);
//       await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      
//       // Set up axios default headers
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       set({
//         user,
//         token,
//         isAuthenticated: true,
//       });
      
//       // Use requestAnimationFrame for smooth transition
//       requestAnimationFrame(() => {
//         router.replace('/(tabs)');
//       });
//     } catch (error) {
//       set({ error: 'Failed to sign up' });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
  
//   signInWithGoogle: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       const [request, response, promptAsync] = Google.useAuthRequest({
//         clientId: GOOGLE_CLIENT_ID!,
//         iosClientId: GOOGLE_EXPO_CLIENT_ID!,
//       });

//       const result = await promptAsync();
//       if (result.type === 'success') {
//         const { authentication } = result;
//         const response = await axios.post(`${API_URL}/api/auth/google`, {
//           idToken: authentication?.idToken,
//         });
        
//         const { user, token } = response.data;
        
//         // Store token and user in AsyncStorage
//         await AsyncStorage.setItem(TOKEN_KEY, token);
//         await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        
//         // Set up axios default headers
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
//         set({
//           user,
//           token,
//           isAuthenticated: true,
//         });
        
//         // Navigate to dashboard
//         router.replace('/(tabs)');
//       }
//     } catch (error) {
//       set({ error: 'Failed to sign in with Google' });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
  
//   signInWithApple: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       const credential = await AppleAuthentication.signInAsync({
//         requestedScopes: [
//           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//           AppleAuthentication.AppleAuthenticationScope.EMAIL,
//         ],
//       });

//       const response = await axios.post(`${API_URL}/api/auth/apple`, {
//         identityToken: credential.identityToken,
//         fullName: credential.fullName,
//       });
//       set({
//         user: response.data.user,
//         token: response.data.token,
//         isAuthenticated: true,
//       });
//     } catch (error) {
//       set({ error: 'Failed to sign in with Apple' });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
  
//   signOut: async () => {
//     try {
//       set({ isLoading: true, error: null });
      
//       // Clear token from AsyncStorage
//       await AsyncStorage.removeItem(TOKEN_KEY);
//       await AsyncStorage.removeItem(USER_KEY);
      
//       // Remove token from axios headers
//       delete axios.defaults.headers.common['Authorization'];
      
//       // Reset state
//       set({ user: null, token: null });
      
//       // Use requestAnimationFrame to ensure navigation happens after state updates
//       requestAnimationFrame(() => {
//         router.replace('/(auth)/login');
//       });
//     } catch (error) {
//       console.error('Sign out error:', error);
//       set({ error: 'Failed to sign out' });
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));