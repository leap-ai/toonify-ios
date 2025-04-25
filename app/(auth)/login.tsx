import React, { useRef, useState, useEffect } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet, Alert, Image, useColorScheme, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { authClient } from '../../stores/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';
import { 
  Text, 
  Button, 
  Input, 
  XStack, 
  YStack, 
  Separator, 
  Card,
  useTheme
} from 'tamagui';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Pre-define image sources for easier reference and preloading
const APPLE_LOGO = "@/assets/images/apple-logo.png";
const GOOGLE_LOGO = "@/assets/images/google-logo.png";

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const errorRef = useRef<string | null>(null);
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Google Sign In Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // From .env
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID, // Uncomment if needed
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // From .env
    // expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID // Can often use webClientId here too
  });

  // Effect to handle Google response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        // Now sign in with better-auth using the ID token
        setIsLoading(true);
        authClient.signIn.social({
          provider: "google",
          idToken: { 
            token: authentication.idToken, 
            accessToken: authentication.accessToken
          }
        }, {
          onRequest: () => {
          },
          onError: (ctx) => {
            console.error("better-auth Google ID Token sign-in failed:", ctx.error);
            errorRef.current = ctx.error.message || "Google sign-in failed during backend verification.";
            setIsLoading(false);
          },
          onSuccess: (ctx) => {
             const userId = ctx?.data?.user?.id;
             if (userId) {
               handleRevenueCatLogin(userId);
             }
            setIsLoading(false);
          }
        });
      } else {
         console.warn("Google Sign-In success response did not contain ID token.");
         setIsLoading(false);
      }
    } else if (response?.type === 'error') {
        console.error("Google Sign-In Error (expo-auth-session):", response.error);
        errorRef.current = response.error?.message || "Google Sign-In failed.";
        setIsLoading(false);
    } else if (response?.type === 'cancel') {
        console.log("Google Sign-In cancelled by user.");
        setIsLoading(false);
    }
  }, [response]);

  const navigateToSignup = () => {
    router.push({
      pathname: '/(auth)/signup',
      params: { animation: 'slide_from_left' }
    });
  };

  const handleRevenueCatLogin = async (userId: string) => {
    if (!userId) {
      console.error('RevenueCat Login Error: No user ID provided.');
      return;
    }
    try {
      console.log(`Attempting RevenueCat login for user: ${userId}`);
      const { customerInfo, created } = await Purchases.logIn(userId);
      console.log(`RevenueCat login successful. Created: ${created}, UserID: ${customerInfo.originalAppUserId}`);
    } catch (error) {
      console.error('RevenueCat login failed:', error);
    }
  };

  const handleEmailLogin = async () => {
    await authClient.signIn.email({
      email,
      password,
    }, {
      onRequest: () => {
        setIsLoading(true);
        errorRef.current = null;
      },
      onError: (ctx) => {
        setIsLoading(false);
        errorRef.current = ctx.error.message!!;
      },
      onSuccess: async (ctx) => {
        try {
          const userId = ctx?.data?.user?.id;
          
          if (userId) {
            await handleRevenueCatLogin(userId);
          } else {
            console.warn("Could not extract user ID after successful email login");
          }
        } catch (error) {
          console.error("Error during post-login processing:", error);
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    errorRef.current = null;
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        // Now sign in with better-auth using the ID token
        await authClient.signIn.social({
          provider: "apple",
          idToken: { token: credential.identityToken }
        }, {
          onRequest: () => {
            console.log("Sending Apple ID Token to better-auth backend...");
            // Already set isLoading = true
          },
          onError: (ctx) => {
            console.error("better-auth Apple ID Token sign-in failed:", ctx.error);
            errorRef.current = ctx.error.message || "Apple sign-in failed during backend verification.";
            setIsLoading(false);
          },
          onSuccess: (ctx) => {
             const userId = ctx?.data?.user?.id;
             if (userId) {
               handleRevenueCatLogin(userId);
             }
            setIsLoading(false);
          }
        });
      } else {
        throw new Error("Apple Sign-In did not return an identity token.");
      }

    } catch (e: any) {
      setIsLoading(false);
      if (e.code === 'ERR_REQUEST_CANCELED') {
        console.log("Apple Sign-In cancelled by user.");
        // Maybe set errorRef.current = "Sign-in cancelled.";
      } else {
        console.error("Apple Sign-In Error:", e);
        errorRef.current = e.message || "An unknown error occurred during Apple Sign-In.";
      }
    }
  };

  const signInWithGoogle = async () => {
    // Prompt the user to sign in
    // The useEffect hook above will handle the response
    setIsLoading(true);
    errorRef.current = null;
    await promptAsync(); 
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <YStack space="$4" padding="$4" justifyContent="center" flex={1}>
        <YStack space="$2" alignItems="center" marginBottom="$4">
          <Text fontSize="$6" fontWeight="bold" color={isDark ? '#FFFFFF' : '#333333'}>
            Welcome to Toonify
          </Text>
          <Text fontSize="$3" color={isDark ? '#BBBBBB' : '#666666'}>
            Sign in to start creating cartoons
          </Text>
        </YStack>
        
        <Card elevate bordered padding="$4" marginBottom="$2" backgroundColor={isDark ? '#1E1E1E' : '#F5F5F5'}>
          <YStack space="$4">
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
              placeholder="Enter your password"
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
              onPress={handleEmailLogin}
              disabled={isLoading}
              fontWeight="bold"
              backgroundColor="#007AFF"
              color="#FFFFFF"
            >
              Sign In
            </Button>
          </YStack>
        </Card>

        {errorRef.current && (
          <Text color="#FF3B30" textAlign="center">{errorRef.current}</Text>
        )}

        <XStack alignItems="center" justifyContent="center" space="$2" marginVertical="$4">
          <View style={[styles.separator, { backgroundColor: isDark ? '#444444' : '#DDDDDD' }]} />
          <Text color={isDark ? '#AAAAAA' : '#999999'}>OR</Text>
          <View style={[styles.separator, { backgroundColor: isDark ? '#444444' : '#DDDDDD' }]} />
        </XStack>

        <XStack justifyContent="center" space="$4">
          <Button 
            onPress={signInWithGoogle}
            disabled={isLoading}
            backgroundColor={'white'}
            borderColor={isDark ? 'white' : theme.background.val}
            borderWidth={isDark ? 1 : 1}
            size="$8"
            circular
            width={56}
            height={56}
            padding={0}
            icon={
              <Image 
                source={require(GOOGLE_LOGO)} 
                style={styles.socialIcon} 
              />
            }
          />

          <Button 
            onPress={signInWithApple}
            disabled={isLoading}
            backgroundColor={'white'}
            borderColor={isDark ? 'white' : theme.background.val}
            borderWidth={isDark ? 1 : 1}
            size="$8"
            circular
            width={56}
            height={56}
            padding={0}
            icon={
              <Image 
                source={require(APPLE_LOGO)} 
                style={styles.socialIcon}
              />
            }
          />
        </XStack>

        <XStack space="$2" justifyContent="center" marginTop="$6">
          <Text color={isDark ? '#FFFFFF' : '#333333'}>Don't have an account?</Text>
          <Pressable onPress={navigateToSignup}>
            <Text color="#007AFF" fontWeight="bold">Sign Up</Text>
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
  socialIcon: {
    width: 40,
    height: 40,
    
  },
  separator: {
    flex: 1,
    height: 1,
  }
});

