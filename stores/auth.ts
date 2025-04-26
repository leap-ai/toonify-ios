import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config";
import type { ImagePickerAsset } from 'expo-image-picker'; // Import the type
import { getAuthHeaders } from "@/utils";

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

/**
 * Uploads a new profile picture to the backend.
 * Relies on the authClient's storage to handle authentication.
 * @param asset - The ImagePickerAsset object containing the image data.
 * @returns The new image URL from the backend on success.
 * @throws If the upload fails.
 */
export const uploadProfilePicture = async (asset: ImagePickerAsset): Promise<string> => {
  const formData = new FormData();

  // Determine the file type and name
  const uriParts = asset.uri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  const fileName = asset.fileName || `profile.${fileType}`;

  // Append the image file to FormData
  // The key 'profilePicture' must match the key expected by multer on the backend
  formData.append('profilePicture', {
    uri: asset.uri,
    name: fileName,
    type: asset.mimeType ?? `image/${fileType}`,
  } as any); // Type assertion needed for FormData append

  try {
    // Note: No manual Authorization header needed here.
    // The expoClient plugin should handle attaching necessary credentials.
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/users/me/profile-picture`, {
      method: 'POST',
      body: formData,
      headers: {
        ...headers,
        // Content-Type is automatically set by fetch when using FormData
        'Content-Type': 'multipart/form-data',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || responseData.message || `HTTP error! status: ${response.status}`);
    }

    // Re-fetch session data to update the UI (e.g., update user.image)
    await authClient.getSession(); 
    
    return responseData.imageUrl; // Assuming backend returns { imageUrl: '...' }

  } catch (error: any) {
    console.error('Upload failed:', error);
    // Re-throw the error so the calling component can handle UI updates (e.g., stop loading state)
    throw new Error(error.message || 'Could not update profile picture. Please try again.');
  }
};