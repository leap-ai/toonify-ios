import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Platform } from 'react-native';
import {
  YStack,
  ScrollView,
  Text,
  H3,
  H4,
  Spinner,
  Separator,
  Button,
  Card,
  XStack,
} from 'tamagui';
import { useSubscriptionStore } from '@/stores/subscription';
import { useAppTheme } from '@/context/ThemeProvider';
import Purchases from 'react-native-purchases';
import { formatRelativeDate } from '@/utils/date';
import CreditItem from '@/components/CreditItem';
import { useRouter } from 'expo-router';
import { ChevronUp, ChevronDown } from '@tamagui/lucide-icons';
import { PLAN_NAMES } from '@/utils/constants';
import Paywall from '@/components/Paywall';

const CreditsScreen = () => {
  const { 
    isActiveProMember,
    proMembershipExpiresAt,
    subscriptionInGracePeriod,
    creditsBalance,
    activeProductId,
    history,
    isLoading,
    error,
    fetchProStatus,
    fetchPaymentsHistory
  } = useSubscriptionStore();

  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const router = useRouter();

  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const toggleHistoryExpanded = () => setIsHistoryExpanded(!isHistoryExpanded);

  useEffect(() => {
    fetchProStatus();
    fetchPaymentsHistory();
  }, [fetchProStatus, fetchPaymentsHistory]);

  const handleManageSubscription = async () => {
    try {
      await Purchases.showManageSubscriptions();
    } catch (e) {
      console.error('Could not open subscription management:', e);
      Alert.alert('Error', 'Could not open subscription management page.');
    }
  };

  const handleViewProPlans = () => {
    router.push('/paywall');
  };

  const visibleHistory = isHistoryExpanded ? history : history.slice(0, 3);

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor={theme.screenBackground}>
        <Spinner size="large" color={theme.tint} />
      </YStack>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.screenBackground }]} 
      contentContainerStyle={styles.scrollContentContainer}
    >
      <YStack space="$4" padding="$4">
        <H3 color={theme.text.primary} marginBottom="$2">Subscription & Credits</H3>
        {/* --- Current Subscription Section --- */}
        <Card bordered elevate padding="$4" backgroundColor={theme.card} borderColor={theme.cardBorder}>
          {isActiveProMember ? (
            <YStack space="$2">
              <XStack justifyContent="space-between">
                <Text color={theme.text.secondary}>Status:</Text>
                <Text color={theme.text.success} fontWeight="bold">
                  {activeProductId && PLAN_NAMES[activeProductId] ? PLAN_NAMES[activeProductId] : 'Pro Member'}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text color={theme.text.secondary}>{subscriptionInGracePeriod ? 'Grace Period Ends:' : 'Renews/Expires:'}</Text>
                <Text color={theme.text.primary} fontWeight="bold">
                  {proMembershipExpiresAt ? formatRelativeDate(proMembershipExpiresAt.toISOString()) : 'N/A'}
                </Text>
              </XStack>
              {subscriptionInGracePeriod && (
                 <Text fontSize="$2" color={theme.text.warning} fontStyle='italic'>
                   There was an issue with your last payment. Please update your payment method to continue service.
                 </Text>
              )}
              <Button 
                marginTop="$3"
                onPress={handleManageSubscription}
                size="$3"
                variant="outlined"
                borderColor={theme.tint}
                color={theme.tint}
              >
                Manage Subscription
              </Button>
            </YStack>
          ) : (
            <YStack space="$3" alignItems='center'>
              <Text color={theme.text.secondary}>You are currently on free plan.</Text>
              <Button
                backgroundColor={theme.button.primary.background}
                color={theme.button.primary.text}
                fontWeight="500"
                hoverStyle={{ backgroundColor: theme.button.primary.hoverBackground }}
                pressStyle={{ backgroundColor: theme.button.primary.pressBackground }}
                onPress={handleViewProPlans}
              >Toonify Pro Plans</Button>
            </YStack>
          )}
        </Card>

        {/* --- Available Credits Section --- */}
        <Card bordered elevate padding="$4" backgroundColor={theme.card} borderColor={theme.cardBorder}>
          <XStack justifyContent="space-between" alignItems="center">
            <H4 color={theme.text.primary}>Available Toon Images:</H4>
            <Text fontSize="$6" fontWeight="bold" color={theme.text.primary}>
              {creditsBalance}
            </Text>
          </XStack>
        </Card>

        {/* --- History Section --- */}
        <Card bordered elevate padding="$4" backgroundColor={theme.card} borderColor={theme.cardBorder}>
          <H4 color={theme.text.primary} marginBottom="$3">History</H4>
          {history.length > 0 ? (
            <YStack space="$1">
              {visibleHistory.map((transaction) => (
                <CreditItem key={transaction.id} item={transaction} />
              ))}
              
              {history.length > 3 && (
                <Button 
                  onPress={toggleHistoryExpanded}
                  marginTop="$2"
                  variant="outlined"
                  borderColor={theme.cardBorder}
                  backgroundColor="transparent"
                  color={theme.text.primary}
                  hoverStyle={{ backgroundColor: theme.button.secondary.hoverBackground }}
                  pressStyle={{ backgroundColor: theme.button.secondary.pressBackground }}
                  icon={isHistoryExpanded ?
                    <ChevronUp size={18} color={theme.text.primary} /> :
                    <ChevronDown size={18} color={theme.text.primary} />
                  }
                  size="$3"
                >
                  {isHistoryExpanded ? "Show Less" : "Show More"}
                </Button>
              )}
            </YStack>
          ) : (
            <Text color={theme.text.secondary}>No transaction history found.</Text>
          )}
           {error && <Text color={theme.text.error} marginTop="$2">Error loading history: {error}</Text>}
        </Card>
      </YStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 50,
  },
});

export default CreditsScreen;