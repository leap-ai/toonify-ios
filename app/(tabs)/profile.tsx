import React, { useState } from 'react';
import { View, StyleSheet, Alert, Modal, Image, Pressable, Platform } from 'react-native';
import { LogOut, Palette, X, ChevronUp, ChevronDown, User, Edit3 } from 'lucide-react-native';
import { authClient } from "@/stores/auth";
import { useCredits } from '@/hooks/useCredits';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

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

export default function ProfileScreen() {
  const { data: session, isPending } = authClient.useSession();
  const { history: creditHistory, isLoading: isCreditsLoading, creditsBalance } = useCredits();
  const { getCurrentTheme, activeThemeVariant } = useAppTheme();
  const theme = getCurrentTheme();
  const [isCreditsExpanded, setIsCreditsExpanded] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isImageOverlayVisible, setIsImageOverlayVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const profileImageUri = session?.user?.image;
  const canEditProfilePicture = profileImageUri?.startsWith('data:image/') ?? true;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const toggleCreditsExpanded = () => {
    setIsCreditsExpanded(!isCreditsExpanded);
  };

  const handleEditProfilePicture = async () => {
    setIsImageOverlayVisible(true)
    // setIsImageOverlayVisible(false);
    // if (Platform.OS !== 'web') {
    //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //   if (status !== 'granted') {
    //     Alert.alert('Permission Denied', 'Camera roll permissions are needed to change the profile picture.');
    //     return;
    //   }
    // }

    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 0.5,
    // });

    // if (!result.canceled && result.assets && result.assets.length > 0) {
    //   const asset = result.assets[0];
    //   setIsUploading(true);
    //   try {
    //     await uploadProfilePicture(asset);
    //   } catch (error: any) {
    //     Alert.alert('Upload Failed', error.message || 'Could not update profile picture.');
    //   } finally {
    //     setIsUploading(false);
    //   }
    // }
  };

  const visibleTransactions = isCreditsExpanded 
    ? creditHistory 
    : creditHistory.slice(0, 3);

  if (isPending) {
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
                fontSize="$4"
                marginTop="$2"
                color={theme.text.secondary}
              >
                {session?.user?.email}
              </Text>
            </YStack>
            <Button 
              icon={<LogOut size={18} color={theme.text.primary} />}
              onPress={handleLogout}
              size="$3"
              chromeless
              color={theme.text.primary}
            >
              Logout
            </Button>
          </XStack>
          
          <Separator marginVertical="$4" backgroundColor={theme.separator} />
          
          <XStack justifyContent="space-between" alignItems="center">
            <Text color={theme.text.primary}>Available Credits</Text>
            <Text 
              fontSize="$4" 
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
                    icon={isCreditsExpanded ?
                      <ChevronUp size={18} color={theme.text.primary} /> :
                      <ChevronDown size={18} color={theme.text.primary} />
                    }
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
                  themeInverse
                  backgroundColor={theme.tint}
                  color={theme.background}
                  size="$3"
                >
                  Get Credits
                </Button>
              </Card>
            )}
          </YStack>

          <YStack space="$2">
            <H4 
              fontWeight="bold" 
              marginBottom="$2"
              color={theme.text.primary}
            >
              Account Settings
            </H4>
            
            <InfoItem 
              title="Theme Settings" 
              onPress={() => setShowThemeModal(true)}
              value={activeThemeVariant.name}
              icon={<Palette size={18} color={theme.tint} />}
            />
            <InfoItem 
              title="Privacy Policy" 
              onPress={() => {}}
              icon={<View style={{ width: 18 }} />}
            />
            <InfoItem 
              title="Terms of Service" 
              onPress={() => {}}
              icon={<View style={{ width: 18 }} />}
            />
            <InfoItem 
              title="App Version" 
              value="1.0.0"
              icon={<View style={{ width: 18 }} />}
            />
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
                    backgroundColor="$backgroundStrong"
                    onPress={() => setIsImageOverlayVisible(false)} 
                    icon={<X size={20} color={theme.text.primary} />}
                    size="$3"
                  />
              </XStack>
              {canEditProfilePicture && (
                <Button
                  icon={isUploading ? <Spinner color={theme.text.primary}/> : <Edit3 size={18} color={theme.text.primary} />}
                  onPress={handleEditProfilePicture}
                  disabled={isUploading}
                  marginBottom="$1"
                  theme="alt1"
                  size="$3"
                  backgroundColor={theme.card}
                  fontWeight="bold"
                  borderColor={theme.cardBorder}
                  borderWidth={1}
                  color={theme.text.primary}
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
                onPress={() => setShowThemeModal(false)} 
                icon={<X size={24} color={theme.text.primary} />}
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