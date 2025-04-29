import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/utils/config";

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

export const getAuthHeaders = async () => {
  const cookies = await authClient.getCookie();
  return {
	Cookie: cookies
  };
};