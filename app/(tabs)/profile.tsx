import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Modal, Image, Pressable, Platform } from 'react-native';
import { LogOut, Palette, X, ChevronUp, ChevronDown, User, Edit3, Trash2 } from 'lucide-react-native';
import { authClient, uploadProfilePicture } from "@/stores/auth";
import { useCredits } from '@/hooks/useCredits';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import { 
  Text, 
  Button, 
  YStack, 
  XStack, 
  Card, 
  Separator, 
  Avatar, 
  Spinner, 
  ScrollView,
  H4,
} from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import ThemeSelector from '@/components/ThemeSelector';
import InfoItem from '@/components/InfoItem';
import CreditItem from '@/components/CreditItem';
import { API_URL } from '@/utils/config';

export default function ProfileScreen() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const { history: creditHistory, isLoading: isCreditsLoading, creditsBalance } = useCredits();
  const { getCurrentTheme, activeThemeVariant } = useAppTheme();
  const theme = getCurrentTheme();
  const [isCreditsExpanded, setIsCreditsExpanded] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isImageOverlayVisible, setIsImageOverlayVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasPasswordAccount, setHasPasswordAccount] = useState<boolean | null>(null);
  const [isCheckingAccountType, setIsCheckingAccountType] = useState(true);

  const profileImageUri = session?.user?.image;
  const canEditProfilePicture = profileImageUri?.startsWith('data:image/') ?? true;

  const appVersion = Constants.expoConfig?.version ?? 'N/A';

  useEffect(() => {
    const checkAccountType = async () => {
      if (!isSessionLoading && session?.user?.id) {
        setIsCheckingAccountType(true);
        try {
          const accountsResult = await authClient.listAccounts();
          if (accountsResult && Array.isArray(accountsResult?.data)) {
            const accounts = accountsResult?.data || [];
            const foundPasswordAccount = accounts.some(
              (account: any) => account.provider === 'credential'
            );
            setHasPasswordAccount(foundPasswordAccount);
          } else {
            console.error("listAccounts did not return expected data:", accountsResult);
            setHasPasswordAccount(false);
          }
        } catch (error) {
          console.error("Failed to list accounts for account type check:", error);
          setHasPasswordAccount(false);
        } finally {
          setIsCheckingAccountType(false);
        }
      } else if (!isSessionLoading) {
        setHasPasswordAccount(false);
        setIsCheckingAccountType(false);
      }
    };

    checkAccountType();
  }, [session, isSessionLoading]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleChangePassword = () => {
    router.push('/(tabs)/change-password');
  };

  const handleDeleteAccountWithPassword = () => {
    Alert.prompt(
      "Delete Account",
      "Are you sure you want to delete your account? Please enter your password to confirm.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async (password) => {
            if (!password) {
              Alert.alert("Error", "Password is required to delete your account.");
              return;
            }
            setIsDeleting(true);
            try {
              await authClient.deleteUser({ password });
              // Sign out is automatically called by better-auth on successful deletion if session exists
              // No need to explicitly call signOut here, but good to be aware
              Alert.alert("Account Deleted", "Your account has been successfully deleted.");
              // AuthHandler will redirect
            } catch (error: any) {
              console.error("Delete account failed:", error);
              const errorMessage = error?.message || "Failed to delete account. Please check your password and try again.";
              Alert.alert("Deletion Failed", errorMessage);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      'secure-text', // Use secure text input for password
      '', // Default value (empty)
      'default' // Keyboard type
    );
  };

  const handleDeleteAccountWithSocials = async () => {
    try {
      await authClient.deleteUser();
      // Sign out is automatically called by better-auth on successful deletion if session exists
      // No need to explicitly call signOut here, but good to be aware
      Alert.alert("Account Deleted", "Your account has been successfully deleted.");
      // AuthHandler will redirect
    } catch (error: any) {
      console.error("Delete account failed:", error);
      const errorMessage = error?.message || "Failed to delete account. Please check your password and try again.";
      Alert.alert("Deletion Failed", errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }
  const toggleCreditsExpanded = () => {
    setIsCreditsExpanded(!isCreditsExpanded);
  };

  const handleEditProfilePicture = async () => {
    setIsImageOverlayVisible(false);
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permissions are needed to change the profile picture.');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setIsUploading(true);
      try {
        await uploadProfilePicture(asset);
      } catch (error: any) {
        Alert.alert('Upload Failed', error.message || 'Could not update profile picture.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const visibleTransactions = isCreditsExpanded 
    ? creditHistory 
    : creditHistory.slice(0, 3);

  if (isSessionLoading) {
    return (
      <View style={[styles.container, styles.centerContainer, { backgroundColor: theme.screenBackground }]}>
        <Spinner size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.screenBackground }]} 
        contentContainerStyle={styles.scrollContentContainer}
      >
        <Card 
          bordered 
          elevate 
          marginBottom="$4" 
          paddingVertical="$2"
          paddingHorizontal="$4"
          backgroundColor={theme.card}
          borderColor={theme.cardBorder}
        >
          <XStack space="$3" alignItems="center">
            <Pressable onPress={() => profileImageUri ? setIsImageOverlayVisible(true) : handleEditProfilePicture()}>
              <Avatar circular size="$6" backgroundColor={theme.card}>
                {profileImageUri ? (
                  <Avatar.Image source={{ uri: profileImageUri }} />
                ) : (
                  <User size={30} color={theme.text.secondary} />
                )}
              </Avatar>
            </Pressable>
            <YStack flex={1}>
              <Text 
                fontSize="$4" 
                fontWeight="bold"
                color={theme.text.primary}
              >
                {session?.user?.name}
              </Text>
              <Text 
                fontSize="$3"
                marginTop="$2"
                color={theme.text.secondary}
              >
                {session?.user?.email}
              </Text>
              <Button 
                icon={<LogOut size={18} color={theme.text.primary} />}
                style={{ marginTop: 10 }}
                onPress={handleLogout}
                size="$3"
                backgroundColor={theme.text.error}
                color={theme.text.primary}
                fontWeight={400}
              >
                Logout
              </Button>
            </YStack>
            
          </XStack>
          
          <Separator marginVertical="$4" backgroundColor={theme.separator} />
          
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$4" color={theme.text.primary}>Available Credits</Text>
            <Text 
              fontSize="$5" 
              fontWeight="bold"
              color={theme.text.primary}
            >
              {creditsBalance}
            </Text>
          </XStack>
        </Card>

        <YStack space="$4">
          <YStack space="$2">
            <H4 
              fontWeight="bold" 
              marginBottom="$2"
              color={theme.text.primary}
            >
              Credits History
            </H4>
            
            {isCreditsLoading ? (
              <YStack alignItems="center" padding="$4">
                <Spinner size="large" color={theme.tint} />
                <Text marginTop="$2" color={theme.text.secondary}>Loading credits history...</Text>
              </YStack>
            ) : creditHistory.length > 0 ? (
              <YStack>
                <YStack>
                  {visibleTransactions.map((transaction: any) => (
                    <CreditItem key={transaction.id} item={transaction} />
                  ))}
                </YStack>
                
                {creditHistory.length > 3 && (
                  <Button 
                    onPress={toggleCreditsExpanded}
                    marginTop="$2"
                    variant="outlined"
                    borderColor={theme.cardBorder}
                    backgroundColor="transparent"
                    color={theme.text.primary}
                    fontWeight="bold"
                    hoverStyle={{ backgroundColor: theme.button.secondary.hoverBackground }}
                    pressStyle={{ backgroundColor: theme.button.secondary.pressBackground }}
                    icon={isCreditsExpanded ?
                      <ChevronUp size={18} color={theme.text.primary} /> :
                      <ChevronDown size={18} color={theme.text.primary} />
                    }
                    size="$3"
                  >
                    {isCreditsExpanded ? "Show Less" : "Show More"}
                  </Button>
                )}
              </YStack>
            ) : (
              <Card 
                padding="$4" 
                bordered 
                alignItems="center"
                backgroundColor={theme.card}
                borderColor={theme.cardBorder}
              >
                <Text 
                  marginBottom="$2" 
                  textAlign="center"
                  color={theme.text.secondary}
                >
                  No credits history available.
                </Text>
                <Button 
                  onPress={() => router.push('/credits')}
                  backgroundColor={theme.button.primary.background}
                  color={theme.button.primary.text}
                  hoverStyle={{ backgroundColor: theme.button.primary.hoverBackground }}
                  pressStyle={{ backgroundColor: theme.button.primary.pressBackground }}
                  size="$3"
                >
                  Get Credits
                </Button>
              </Card>
            )}
          </YStack>
            {/* App Settings */}
          <YStack space="$2">
            <H4 
              fontWeight="bold" 
              marginBottom="$2"
              color={theme.text.primary}
            >
              App Settings
            </H4>
            
            <InfoItem 
              title="Theme Settings" 
              onPress={() => setShowThemeModal(true)}
              value={activeThemeVariant.name}
              icon={<Palette size={18} color={theme.tint} />}
            />
            <InfoItem 
              title="Privacy Policy" 
              onPress={() => {
                router.push({
                  pathname: '/legal',
                  params: { url: `${API_URL}/privacy-policy.html`, title: 'Privacy Policy' },
                });
              }}
              icon={<View style={{ width: 18 }} />}
            />
            <InfoItem 
              title="Terms of Service" 
              onPress={() => {
                router.push({
                  pathname: '/legal',
                  params: { url: `${API_URL}/terms-and-conditions.html`, title: 'Terms and Conditions' },
                });
              }}
              icon={<View style={{ width: 18 }} />}
            />
            <InfoItem 
              title="Support" 
              onPress={() => {
                router.push({
                  pathname: '/legal',
                  params: { url: `${API_URL}/support.html`, title: 'Support' },
                });
              }}
              icon={<View style={{ width: 18 }} />}
            />
            <InfoItem 
              title="App Version" 
              value={appVersion}
              icon={<View style={{ width: 18 }} />}
            />
          </YStack>

          <YStack space="$2">
            <H4 
              fontWeight="bold" 
              marginBottom="$2"
              color={theme.text.primary}
            >
              Account Settings
            </H4>
            
            {!isCheckingAccountType && hasPasswordAccount && (
              <Button 
                onPress={handleChangePassword} 
                backgroundColor={theme.button.primary.background}
                color={theme.button.primary.text}
                hoverStyle={{ backgroundColor: theme.button.primary.hoverBackground }}
                pressStyle={{ backgroundColor: theme.button.primary.pressBackground }}
                fontWeight="400"
                size="$4"
                marginTop="$3"
              >
                Change Password
              </Button>
            )}
            <Button 
              onPress={hasPasswordAccount ? handleDeleteAccountWithPassword : handleDeleteAccountWithSocials} 
              icon={isDeleting ? <Spinner color={theme.button.destructive.text} /> : <Trash2 size={18} color={theme.button.destructive.text} />}
              backgroundColor={theme.button.destructive.background}
              color={theme.button.destructive.text}
              hoverStyle={{ backgroundColor: theme.button.destructive.hoverBackground }}
              pressStyle={{ backgroundColor: theme.button.destructive.pressBackground }}
              disabled={isSessionLoading || isCheckingAccountType || isDeleting}
              fontWeight="400"
              size="$4"
              marginTop="$3"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </YStack>
          <View style={styles.footer}>
            <Text color={theme.text.secondary} fontSize="$3">© 2025 Toonify. All rights reserved.</Text>
          </View>
        </YStack>
      </ScrollView>

      <Modal
        visible={isImageOverlayVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsImageOverlayVisible(false)}
      >
        <Pressable style={[styles.modalOverlay, { backgroundColor: theme.overlayBackground }]} onPress={() => setIsImageOverlayVisible(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={[styles.imageModalContent, { backgroundColor: theme.card }]}>
              {profileImageUri && (
                <Image 
                  source={{ uri: profileImageUri }} 
                  style={styles.fullImage} 
                  resizeMode="contain" 
                />
              )}
              <XStack position="absolute" top="$3" right="$3">
                 <Button 
                    chromeless
                    circular 
                    pressStyle={{ backgroundColor: theme.button.secondary.pressBackground }}
                    onPress={() => setIsImageOverlayVisible(false)} 
                    icon={<X size={20} color={theme.text.primary} />}
                    size="$3"
                    backgroundColor="transparent"
                  />
              </XStack>
              {canEditProfilePicture && (
                <Button
                  icon={isUploading ? <Spinner color={theme.button.secondary.text}/> : <Edit3 size={18} color={theme.button.secondary.text} />}
                  onPress={handleEditProfilePicture}
                  disabled={isUploading}
                  marginBottom="$1"
                  backgroundColor={theme.button.secondary.background}
                  color={theme.button.secondary.text}
                  hoverStyle={{ backgroundColor: theme.button.secondary.hoverBackground }}
                  pressStyle={{ backgroundColor: theme.button.secondary.pressBackground }}
                  size="$3"
                  borderColor={theme.cardBorder}
                  borderWidth={1}
                >
                  {isUploading ? 'Uploading...' : 'Edit Photo'}
                </Button>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showThemeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.overlayBackground }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <H4 color={theme.text.primary}>Theme Settings</H4>
              <Button 
                chromeless
                circular 
                pressStyle={{ backgroundColor: theme.button.secondary.pressBackground }}
                onPress={() => setShowThemeModal(false)} 
                icon={<X size={24} color={theme.text.primary} />}
                backgroundColor="transparent"
              />
            </XStack>
            <ThemeSelector onClose={() => setShowThemeModal(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageModalContent: {
    width: '95%',
    maxWidth: 500,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
  },
});