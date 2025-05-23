import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import Purchases from 'react-native-purchases';
import { authClient } from '@/stores/auth';
import { useSubscriptionStore } from '@/stores/subscription';

// Function to handle RevenueCat login 
const handleRevenueCatLogin = async (userId: string) => {
    if (!userId) {
        console.error('RevenueCat Login Error (AuthHandler): No user ID provided.');
        return;
    }
    try {
        console.log(`Attempting RevenueCat login from AuthHandler for user: ${userId}`);
        const { customerInfo, created } = await Purchases.logIn(userId);
        console.log(`RevenueCat login from AuthHandler successful. Created: ${created}, UserID: ${customerInfo.originalAppUserId}`);
    } catch (error) {
        // Handle error code 9 (already logged in) silently
        if ((error as any)?.code !== 9) { 
            console.error('RevenueCat login failed in AuthHandler:', error);
        } else {
            console.log('RevenueCat user already logged in (ignored error code 9).')
        }
    }
};

const AuthHandler = () => {
    const posthog = usePostHog();
    const { data: session, isPending: isAuthLoading } = authClient.useSession();
    const segments = useSegments();
    const router = useRouter();
    const [isNavigationReady, setIsNavigationReady] = useState(false);
    // Get the fetch action from the subscription store
    const fetchProStatus = useSubscriptionStore((state) => state.fetchProStatus);
    // State to track if setup has been done for the current user
    const [setupDoneForUser, setSetupDoneForUser] = useState<string | null>(null);

    useEffect(() => {
        if (router && segments) {
            setIsNavigationReady(true);
        }
    }, [router, segments]);

    useEffect(() => {
        const handleAuthFlow = async () => {
            if (!isNavigationReady || isAuthLoading) return;

            const inAuthGroup = segments[0] === '(auth)';
            const currentUserId = session?.user?.id;

            if (currentUserId) {
                // --- Run Setup only once per user ID --- 
                if (setupDoneForUser !== currentUserId) {
                    console.log(`AuthHandler: Running setup for user ${currentUserId}`);
                    handleRevenueCatLogin(currentUserId);

                    await fetchProStatus(); // Fetch pro status from backend
                    const { isActiveProMember } = useSubscriptionStore.getState(); // Get updated state
                    
                    // Identify user with PostHog
                    if (posthog) {
                        posthog.identify(
                            currentUserId, 
                            { 
                                email: session?.user?.email,
                                name: session?.user?.name,
                                is_pro_user: isActiveProMember,
                            }
                        );
                    }
                    setSetupDoneForUser(currentUserId); // Mark setup as done for this user
                }
                // --- End Setup Logic ---
                
                // Navigation logic
                if (inAuthGroup) {
                    router.replace('/(tabs)');
                }
            } else {
                // User is logged out
                if (setupDoneForUser !== null) {
                    console.log("AuthHandler: Clearing setup state on logout.");
                    if (posthog) {
                        posthog.reset(); // Reset PostHog session on logout
                    }
                    setSetupDoneForUser(null); // Reset setup state on logout
                }
            
                // Optionally clear subscription state on logout if needed
                // useSubscriptionStore.getState().reset(); 
                if (!inAuthGroup && segments[0] !== 'legal') {
                    router.replace('/(auth)');
                }
            }
        };

        handleAuthFlow();
        // Dependency array includes everything needed for the logic inside
    }, [session, posthog, isAuthLoading, segments, router, isNavigationReady, fetchProStatus, setupDoneForUser]);

    // This component does not render anything
    return null;
};

export default AuthHandler; 