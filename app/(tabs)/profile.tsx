import React, { useState } from 'react';
import { View, StyleSheet, Alert, Modal } from 'react-native';
import { LogOut, Palette, X, ChevronUp, ChevronDown } from 'lucide-react-native';
import { authClient } from "@/stores/auth";
import { useCredits } from '@/hooks/useCredits';
import { router } from 'expo-router';
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
  H4
} from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import ThemeSelector from '@/components/ThemeSelector';
import InfoItem from '@/components/InfoItem';
import CreditItem from '@/components/CreditItem';

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();
  const { history: creditHistory, isLoading: isCreditsLoading, creditsBalance } = useCredits();
  const { getCurrentTheme, activeThemeVariant } = useAppTheme();
  const theme = getCurrentTheme();
  const [isCreditsExpanded, setIsCreditsExpanded] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const toggleCreditsExpanded = () => {
    setIsCreditsExpanded(!isCreditsExpanded);
  };

  const visibleTransactions = isCreditsExpanded 
    ? creditHistory 
    : creditHistory.slice(0, 3);

  return (
    <>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.screenBackground }]} 
        contentContainerStyle={{ padding: 15 }}
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
            <Avatar circular size="$6">
              <Avatar.Image source={{ uri: 'https://i.pravatar.cc/300' }} />
              <Avatar.Fallback backgroundColor={theme.tint} />
            </Avatar>
            <YStack flex={1}>
              <Text 
                fontSize="$4" 
                fontWeight="bold"
                color={theme.text.primary}
              >
                {session?.user?.name}
              </Text>
              <Text 
                fontSize="$2" 
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
                  {visibleTransactions.map((transaction) => (
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
            onPress={() => router.push('/privacy-policy')}
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
        </YStack>
      </ScrollView>

      <Modal
        visible={showThemeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
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
  }
});