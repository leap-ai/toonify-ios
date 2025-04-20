import React, { useRef, useState } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { authClient } from '../../stores/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const errorRef = useRef<string | null>(null);

  const handleEmailLogin = async () => {
    await authClient.signIn.email({
      email,
      password,
    }, {
      onRequest: () => {
        setIsLoading(true);
      },
      onError: (ctx) => {
        setIsLoading(false);
        errorRef.current = ctx.error.message!!;
      },
      onSuccess: () => {
        setIsLoading(false);
      }
    })
  };

  const signInWithApple = async () => {
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
          idToken: {
            token: credential.identityToken
          }
        }, {
          onRequest: () => {
            console.log("Trying signed in with Apple");
            setIsLoading(true);
          },
          onError: (ctx) => {
            console.log("Failed signed in with Apple");
            setIsLoading(false);
            errorRef.current = ctx.error.message!!;
          },
          onSuccess: () => {
            setIsLoading(false);
            console.log("Successfully signed in with Apple");
            // router.push("/(tabs)")
          }
        });
      } else {
        errorRef.current = "No identity token";
      }
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        Alert.alert("Apple Sign In Cancelled", "Please try again");
      } else {
        throw new Error(error);
      }
    }
  }

    
  //   await authClient.signIn.social({
  //       provider: "apple",
  //   }, {
  //     onRequest: () => {
  //       setIsLoading(true);
  //     },
  //     onError: (ctx) => {
  //       setIsLoading(false);
  //       errorRef.current = ctx.error.message!!;
  //     },
  //     onSuccess: () => {
  //       setIsLoading(false);
  //     }
  //   })
  // }

  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/(tabs)",
      }, {
        onRequest: () => {
          console.log("Trying signed in with Google");
          setIsLoading(true);
        },
        onError: (ctx) => {
          console.log("Failed signed in with Google");
          setIsLoading(false);
          errorRef.current = ctx.error.message!!;
        },
        onSuccess: () => {
          setIsLoading(false);
          console.log("Successfully signed in with Google");
        }
      });
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        Alert.alert("Apple Sign In Cancelled", "Please try again");
      } else {
        throw new Error(error);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Toonify</Text>
        <Text style={styles.subtitle}>Sign in to start creating cartoons</Text>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleEmailLogin}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {errorRef.current && (
          <Text style={styles.errorText}>{errorRef.current}</Text>
        )}

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={signInWithGoogle}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.appleButton]}
            onPress={signInWithApple}
          >
            <Text style={styles.buttonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialButtons: {
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});