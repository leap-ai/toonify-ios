import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Image, View, Pressable, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { UserPlus, User } from 'lucide-react-native';
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
  H5,
  Checkbox,
  Label
} from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { API_URL } from '@/utils/config';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const errorRef = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [readPrivacy, setReadPrivacy] = useState(false);
  const { getCurrentTheme, isDarkMode } = useAppTheme();
  const theme = getCurrentTheme();

  useEffect(() => {
    setErrorMessage(errorRef.current);
  }, [errorRef.current]);

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
    } else if (!result.canceled) {
        console.warn("Image picker result did not contain base64 data.");
        Alert.alert("Image Error", "Could not process the selected image. Please try a different one.");
    }
  };

  const handleSignup = async () => {
    errorRef.current = null; 
    setErrorMessage(null);

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
        errorRef.current = ctx.error?.message ?? 'An unknown error occurred during sign up.'; 
      },
      onSuccess: () => {
        setIsLoading(false);
      }
    })
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  const dynamicStyles = StyleSheet.create({
    imagePicker: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.separator,
        backgroundColor: theme.card,
      },
      profileImage: {
        width: '100%',
        height: '100%',
      },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <YStack space="$4" padding="$4" justifyContent="center" flex={1}>
        <YStack space="$2" alignItems="center" marginBottom="$4">
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="cover"
          />
          <Text fontSize="$6" fontWeight="bold" color={theme.text.primary}>
            Create Account
          </Text>
          <Text fontSize="$3" color={theme.text.secondary}>
            Sign up to start creating cartoons
          </Text>
        </YStack>
        
        <YStack alignItems="center" marginBottom="$4">
          <Pressable onPress={pickImage} style={dynamicStyles.imagePicker}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={dynamicStyles.profileImage} />
            ) : (
              <User size={40} color={theme.text.tertiary} /> 
            )}
          </Pressable>
          <Text fontSize="$4" color={theme.text.secondary} marginTop="$2">
             {imageUri ? 'Change Photo' : 'Add Profile Photo'}
          </Text>
        </YStack>
        
        <Card elevate bordered padding="$4" marginBottom="$2" backgroundColor={theme.card} borderColor={theme.cardBorder}>
          <YStack space="$4">
            <Input
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              size="$4"
              backgroundColor={theme.background}
              color={theme.text.primary}
              placeholderTextColor={theme.text.tertiary}
              borderColor={theme.separator}
            />
            <Input
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              size="$4"
              backgroundColor={theme.background}
              color={theme.text.primary}
              placeholderTextColor={theme.text.tertiary}
              borderColor={theme.separator}
            />
            <Input
              placeholder="Create your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              size="$4"
              backgroundColor={theme.background}
              color={theme.text.primary}
              placeholderTextColor={theme.text.tertiary}
              borderColor={theme.separator}
            />

            <YStack space="$3">
              <XStack alignItems="center" space="$2">
                <Checkbox 
                  id="terms-checkbox" 
                  checked={acceptedTerms} 
                  onCheckedChange={() => setAcceptedTerms(!acceptedTerms)}
                  size="$4"
                  borderColor={theme.separator}
                  backgroundColor={acceptedTerms ? theme.text.accent : undefined}
                >
                    <Checkbox.Indicator />
                </Checkbox>
                <Label htmlFor="terms-checkbox" flex={1}>
                  <Text fontSize="$3" color={theme.text.secondary}>
                    I accept the app's {' '}
                    <Text 
                      color={theme.tint} 
                      fontWeight="bold"
                      onPress={() => router.push({ 
                        pathname: '/legal', 
                        params: { url: `${API_URL}/terms-and-conditions.html`, title: 'Terms and Conditions' } 
                      })}
                    >
                      Terms and Conditions
                    </Text>.
                  </Text>
                </Label>
              </XStack>
              <XStack alignItems="center" space="$2">
                <Checkbox 
                  id="privacy-checkbox" 
                  checked={readPrivacy} 
                  onCheckedChange={() => setReadPrivacy(!readPrivacy)}
                  size="$4"
                  borderColor={theme.separator}
                  backgroundColor={readPrivacy ? theme.text.accent : undefined}
                >
                    <Checkbox.Indicator />
                </Checkbox>
                <Label htmlFor="privacy-checkbox" flex={1}>
                  <Text fontSize="$3" color={theme.text.secondary}>
                    I confirm I have read the {' '}
                    <Text 
                      color={theme.tint} 
                      fontWeight="bold"
                      onPress={() => router.push({ 
                        pathname: '/legal', 
                        params: { url: `${API_URL}/privacy-policy.html`, title: 'Privacy Policy' } 
                      })}
                    >
                      Privacy Policy
                    </Text>.
                  </Text>
                </Label>
              </XStack>
            </YStack>

            <Button
              theme="active"
              backgroundColor={theme.tint}
              color={theme.text.primary}
              size="$4"
              onPress={handleSignup}
              disabled={isLoading || !acceptedTerms || !readPrivacy}
              icon={isLoading ? undefined : <UserPlus size={18} />}
            >
              {isLoading ? (
                <XStack space="$2" alignItems="center">
                  <Spinner size="small" />
                  <Text fontWeight="bold">Creating Account...</Text>
                </XStack>
              ) : (
                <Text fontWeight="bold">Create Account</Text>
              )}
            </Button>
          </YStack>
        </Card>

        {errorMessage && (
          <H5 color={theme.text.error} textAlign="center" marginTop="$2">
            {errorMessage}
          </H5>
        )}
        <XStack space="$2" justifyContent="center" marginTop="$6">
          <Text color={theme.text.secondary} paddingTop="$1">Already have an account?</Text>
          <Button 
            unstyled 
            pressStyle={{ opacity: 0.7 }}
            onPress={navigateToLogin}
            color={theme.text.accent}
            fontWeight="bold"
           >
            Sign In
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 48,
    height: 48,
  },
  container: {
    flex: 1,
  },
});

