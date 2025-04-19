import { Redirect } from 'expo-router';
import { authClient } from '../stores/auth';

export default function Index() {
  const { data: session } = authClient.useSession();
  
  if (session?.user?.id) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
