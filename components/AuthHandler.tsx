import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { authClient } from '@/stores/auth';
import Purchases from 'react-native-purchases';

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
    const { data: session, isPending: isAuthLoading } = authClient.useSession();
    const segments = useSegments();
    const router = useRouter();
    // State to prevent calling RC login multiple times on rapid state changes
    const [rcLoginAttemptedForUser, setRcLoginAttemptedForUser] = useState<string | null>(null);

    useEffect(() => {
        // Don't run logic until auth state is determined
        if (isAuthLoading) {
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        const isLegalRoute = segments[0] === 'legal';
        const currentUserId = session?.user?.id;

        // --- Side Effects based on Auth State ---
        if (currentUserId) {
            // User is logged in
            
            // 1. RevenueCat Login (if needed)
            if (!inAuthGroup && rcLoginAttemptedForUser !== currentUserId) {
                handleRevenueCatLogin(currentUserId);
                setRcLoginAttemptedForUser(currentUserId); // Mark attempted for this user ID
            }

            // 2. Redirect if they are in the auth group
            if (inAuthGroup) {
                router.replace('/(tabs)');
            }
        } else {
            // User is logged out
            setRcLoginAttemptedForUser(null); // Reset RC login attempt state on logout

            // 3. Redirect to auth group if they are outside and not on legal page
            if (!inAuthGroup && !isLegalRoute) {
                router.replace('/(auth)');
            }
        }
        // --- End Side Effects ---

    }, [session, isAuthLoading, segments, router, rcLoginAttemptedForUser]);

    // This component does not render anything
    return null;
};

export default AuthHandler; 