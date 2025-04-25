import React, { useState, useRef } from 'react';
import { StyleSheet, Image, useColorScheme, View, Pressable, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { UserPlus, ImagePlus, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { authClient } from '@/stores/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  YStack, 
  Text, 
  Input, 
  Button, 
  XStack, 
  Card,
  Spinner,
  useTheme
} from 'tamagui';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const errorRef = useRef<string | null>(null);
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
        const asset = result.assets[0];
        const mimeType = asset.mimeType ?? 'image/jpeg';
        const dataUri = `data:${mimeType};base64,${asset.base64}`;
        setImageUri(dataUri);
    }
  };

  const handleSignup = async () => {
    errorRef.current = null; 

    const payload: any = {
      email,
      password,
      name,
    };

    if (imageUri) {
      payload.image = imageUri;
    }

    await authClient.signUp.email(payload, {
      onRequest: () => {
        setIsLoading(true);
      },
      onError: (ctx) => {
        setIsLoading(false);
        errorRef.current = ctx.error?.message ?? 'An unknown error occurred.'; 
        setName(name => name); 
      },
      onSuccess: () => {
        setIsLoading(false);
      }
    })
  };

  const navigateToLogin = () => {
    router.push({
      pathname: '/(auth)/login',
      params: { animation: 'slide_from_left' }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <YStack space="$4" padding="$4" justifyContent="center" flex={1}>
        <YStack space="$2" alignItems="center" marginBottom="$4">
          <Text fontSize="$6" fontWeight="bold" color={isDark ? '#FFFFFF' : '#333333'}>
            Create Account
          </Text>
          <Text fontSize="$3" color={isDark ? '#BBBBBB' : '#666666'}>
            Sign up to start creating cartoons
          </Text>
        </YStack>
        
        <YStack alignItems="center" marginBottom="$4">
          <Pressable onPress={pickImage} style={[styles.imagePicker, { backgroundColor: isDark ? theme.gray5.val : theme.gray5.val }]}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <User size={40} color={isDark ? theme.gray10.val : theme.gray10.val} /> 
            )}
          </Pressable>
          <Text fontSize="$4" color={isDark ? theme.gray11.val : theme.gray11.val} marginTop="$2">
             {imageUri ? 'Change Photo' : 'Add Profile Photo'}
          </Text>
        </YStack>
        
        <Card elevate bordered padding="$4" marginBottom="$2" backgroundColor={isDark ? '#1E1E1E' : '#F5F5F5'}>
          <YStack space="$4">
            <Input
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              size="$4"
              backgroundColor={isDark ? '#2A2A2A' : '#FFFFFF'}
              color={isDark ? '#FFFFFF' : '#333333'}
              placeholderTextColor={isDark ? '#AAAAAA' : '#999999'}
              borderColor={isDark ? '#444444' : '#CCCCCC'}
            />
            <Input
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              size="$4"
              backgroundColor={isDark ? '#2A2A2A' : '#FFFFFF'}
              color={isDark ? '#FFFFFF' : '#333333'}
              placeholderTextColor={isDark ? '#AAAAAA' : '#999999'}
              borderColor={isDark ? '#444444' : '#CCCCCC'}
            />
            <Input
              placeholder="Create your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              size="$4"
              backgroundColor={isDark ? '#2A2A2A' : '#FFFFFF'}
              color={isDark ? '#FFFFFF' : '#333333'}
              placeholderTextColor={isDark ? '#AAAAAA' : '#999999'}
              borderColor={isDark ? '#444444' : '#CCCCCC'}
            />

            <Button
              themeInverse
              size="$4"
              onPress={handleSignup}
              disabled={isLoading}
              fontWeight="bold"
              icon={isLoading ? undefined : <UserPlus size={18} color={isDark ? '#FFFFFF' : '#FFFFFF'} />}
              backgroundColor="#007AFF"
              color="#FFFFFF"
            >
              {isLoading ? (
                <XStack space="$2" alignItems="center">
                  <Spinner size="small" color="#FFFFFF" />
                  <Text color="#FFFFFF">Creating Account...</Text>
                </XStack>
              ) : (
                <Text color="#FFFFFF">Create Account</Text>
              )}
            </Button>
          </YStack>
        </Card>

        {errorRef.current && (
          <Text color="$red10" textAlign="center" marginTop="$2">{errorRef.current}</Text>
        )}
        <XStack space="$2" justifyContent="center" marginTop="$6">
          <Text color={isDark ? '#FFFFFF' : '#333333'}>Already have an account?</Text>
          <Pressable onPress={navigateToLogin}>
            <Text color="#007AFF" fontWeight="bold">Sign In</Text>
          </Pressable>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});

