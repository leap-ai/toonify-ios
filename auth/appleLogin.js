import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export async function loginWithApple() {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const res = await axios.post(`${API_BASE}/auth/apple`, {
    id_token: credential.identityToken,
  });

  await SecureStore.setItemAsync('token', res.data.token);
}