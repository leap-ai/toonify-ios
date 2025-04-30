import React, { useRef, useState, useEffect } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet, Alert, Image, Pressable } from 'react-native';
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
  H5,
} from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@/utils/config';

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const errorRef = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { getCurrentTheme, isDarkMode } = useAppTheme();
  const theme = getCurrentTheme();

  // Google Sign In Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        setIsLoading(true);
        errorRef.current = null;
        authClient.signIn.social({
          provider: "google",
          idToken: { 
            token: authentication.idToken, 
            accessToken: authentication.accessToken
          }
        }, {
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
         errorRef.current = "Could not retrieve Google ID token.";
         setIsLoading(false);
      }
    } else if (response?.type === 'error') {
        console.error("Google Sign-In Error (expo-auth-session):", response.error);
        errorRef.current = response.error?.message || "Google Sign-In failed.";
        setIsLoading(false);
    } else if (response?.type === 'cancel') {
        console.log("Google Sign-In cancelled by user.");
        errorRef.current = null;
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
        errorRef.current = ctx.error.message || "An unknown error occurred.";
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
        await authClient.signIn.social({
          provider: "apple",
          idToken: { token: credential.identityToken }
        }, {
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
        errorRef.current = null;
      } else {
        console.error("Apple Sign-In Error:", e);
        errorRef.current = e.message || "An unknown error occurred during Apple Sign-In.";
      }
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    errorRef.current = null;
    await promptAsync(); 
  };

  useEffect(() => {
    if (errorRef.current) {
      setErrorMessage(errorRef.current);
    }
  }, [errorRef.current]);

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
            Welcome to Toonify
          </Text>
          <Text fontSize="$3" color={theme.text.secondary}>
            Sign in to start creating cartoons
          </Text>
        </YStack>
        
        <Card elevate bordered padding="$4" marginBottom="$2" backgroundColor={theme.card} borderColor={theme.cardBorder}>
          <YStack space="$4">
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
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              size="$4"
              backgroundColor={theme.background}
              color={theme.text.primary}
              placeholderTextColor={theme.text.tertiary}
              borderColor={theme.separator}
            />
            
            <Button 
              theme="active"
              backgroundColor={theme.tint}
              color={theme.text.primary}
              size="$4" 
              onPress={handleEmailLogin}
              disabled={isLoading}
              fontWeight="bold"
            >
              Sign In
            </Button>
          </YStack>
        </Card>

        {errorMessage && (
          <H5 textAlign="center" color={theme.text.error} marginTop="$2">
            {errorMessage}
          </H5>
        )}

        <XStack alignItems="center" space="$4" marginTop="$4">
          <Separator flex={1} borderColor={theme.separator} />
          <Text color={theme.text.tertiary}>Or sign in with</Text>
          <Separator flex={1} borderColor={theme.separator} />
        </XStack>

        <XStack space="$4" marginTop="$4" justifyContent="center">
          <Button
            size="$8"
            onPress={signInWithApple}
            disabled={isLoading}
            circular
            backgroundColor={theme.card}
            borderColor={theme.separator}
            borderWidth={1}
            padding="$2"
            icon={
              isDarkMode ?
              <Image 
                source={require('@/assets/images/apple-logo-light.png')} 
                style={styles.socialIcon}
              /> :
              <Image 
                source={require('@/assets/images/apple-logo.png')} 
                style={styles.socialIcon}
              />
            }
          />

          <Button
            size="$8"
            onPress={signInWithGoogle}
            disabled={isLoading || !request}
            circular
            backgroundColor={theme.card}
            borderColor={theme.separator}
            borderWidth={1}
            padding="$2"
            icon={
              <Image 
                source={require('@/assets/images/google-logo.png')} 
                style={styles.socialIcon}
              />
            }
          />
        </XStack>

        <XStack justifyContent="center" alignItems="center" space="$2" marginTop="$6">
          <Text color={theme.text.secondary}>Don't have an account?</Text>
          <Button
            unstyled
            pressStyle={{ opacity: 0.7 }}
            onPress={navigateToSignup}
            color={theme.tint}
            fontWeight="bold"
          >
            Sign Up
          </Button>
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
    width: 36,
    height: 36,
  },
  logo: {
    width: 48,
    height: 48,
  },
});

