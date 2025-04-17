import { create } from 'zustand';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import axios from 'axios';
import { API_URL, GOOGLE_CLIENT_ID, GOOGLE_EXPO_CLIENT_ID } from '@env';

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
}

WebBrowser.maybeCompleteAuthSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({ error: 'Failed to sign in' });
    } finally {
      set({ isLoading: false });
    }
  },
  signup: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({ error: 'Failed to sign up' });
    } finally {
      set({ isLoading: false });
    }
  },
  signInWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null });
      const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_CLIENT_ID!,
        iosClientId: GOOGLE_EXPO_CLIENT_ID!,
      });

      const result = await promptAsync();
      if (result.type === 'success') {
        const { authentication } = result;
        const response = await axios.post(`${API_URL}/auth/google`, {
          idToken: authentication?.idToken,
        });
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      set({ error: 'Failed to sign in with Google' });
    } finally {
      set({ isLoading: false });
    }
  },
  signInWithApple: async () => {
    try {
      set({ isLoading: true, error: null });
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const response = await axios.post(`${API_URL}/auth/apple`, {
        identityToken: credential.identityToken,
        fullName: credential.fullName,
      });
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({ error: 'Failed to sign in with Apple' });
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(`${API_URL}/auth/signout`, null, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      });
      set({ user: null, token: null, isAuthenticated: false });
    } catch (error) {
      set({ error: 'Failed to sign out' });
    } finally {
      set({ isLoading: false });
    }
  },
}));