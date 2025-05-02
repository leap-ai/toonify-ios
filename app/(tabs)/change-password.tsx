import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { authClient } from '@/stores/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text, 
  Button, 
  Input, 
  XStack, 
  YStack, 
  Card,
  Spinner,
  H4,
} from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();

  const handleChangePassword = async () => {
    setErrorMessage(null);
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    
    setIsLoading(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      Alert.alert('Success', 'Password changed successfully.');
      router.back(); // Go back to profile on success
    } catch (error: any) {
      console.error("Change password failed:", error);
      setErrorMessage(error?.message || "Failed to change password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor={theme.screenBackground} justifyContent="center">
      {/* Header */}
      <XStack 
        padding="$3" 
        alignItems="center" 
        borderBottomColor={theme.separator} 
        borderBottomWidth={1}
        backgroundColor={theme.headerBackground}
      >
        <Button 
          icon={<ArrowLeft size={24} color={theme.text.primary} />} 
          onPress={() => router.back()} 
          chromeless
          circular
          marginRight="$2"
        />
        <H4 color={theme.text.primary} fontWeight="bold">Change Password</H4>
      </XStack>

      <YStack space="$4" marginTop="$4" padding="$4" flex={1}>
        <Card 
          bordered 
          padding="$4"
          backgroundColor={theme.card}
          borderColor={theme.cardBorder}
        >
          <YStack space="$4">
            <Input
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              size="$4"
              backgroundColor={theme.background}
              color={theme.text.primary}
              placeholderTextColor={theme.text.tertiary}
              borderColor={theme.separator}
            />
            <Input
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              size="$4"
              backgroundColor={theme.background}
              color={theme.text.primary}
              placeholderTextColor={theme.text.tertiary}
              borderColor={theme.separator}
            />
            <Input
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              size="$4"
              backgroundColor={theme.background}
              color={theme.text.primary}
              placeholderTextColor={theme.text.tertiary}
              borderColor={theme.separator}
            />
            
            <Button 
              onPress={handleChangePassword} 
              disabled={isLoading || !currentPassword || !newPassword || !confirmNewPassword}
              backgroundColor={theme.button.primary.background}
              color={theme.button.primary.text}
              hoverStyle={{ backgroundColor: theme.button.primary.hoverBackground }}
              pressStyle={{ backgroundColor: theme.button.primary.pressBackground }}
              icon={isLoading ? <Spinner color={theme.button.primary.text} /> : undefined}
              size="$4"
              fontWeight={400}
              opacity={(isLoading || !currentPassword || !newPassword || !confirmNewPassword) ? 0.6 : 1}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </YStack>
        </Card>

        {errorMessage && (
          <Text textAlign="center" color={theme.text.error} marginTop="$2">
            {errorMessage}
          </Text>
        )}
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 