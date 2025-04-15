import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_BASE = 'https://your-backend.com';

export async function loginWithGoogle() {
  const { type, authentication } = await Google.logInAsync({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    scopes: ['profile', 'email'],
  });

  if (type === 'success') {
    const res = await axios.post(`${API_BASE}/auth/google`, {
      id_token: authentication.idToken,
    });

    await SecureStore.setItemAsync('token', res.data.token);
  }
}