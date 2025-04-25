import React from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useGenerationStore } from '../stores/generation';
import { 
  Text, 
  Button, 
  Spinner, 
  XStack, 
  Card,
  H3,
  YStack
} from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';

interface CreateCardProps {
  error?: string | null;
  onErrorChange?: (error: string | null) => void;
}

const CreateCard: React.FC<CreateCardProps> = ({ 
  error, 
  onErrorChange = () => {} 
}) => {
  const router = useRouter();
  const { generateImage, isLoading } = useGenerationStore();
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();

  const pickImage = async () => {
    try {
      onErrorChange(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await generateImage(result.assets[0].uri);
        router.push('/(tabs)/history');
      }
    } catch (err) {
      console.error('Error picking image:', err);
      const errorMessage = 'Failed to pick image. Please try again.';
      onErrorChange(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <Card 
      elevate 
      padding="$5" 
      margin="$4" 
      bordered
      backgroundColor={theme.card}
      borderColor={theme.cardBorder}
    >
      <YStack space="$3" alignItems="center">
        <H3 
          color={theme.text.primary} 
          fontWeight="bold" 
          textAlign="center"
        >
          Create Your Cartoon
        </H3>
        
        <Text 
          fontSize="$3" 
          color={theme.text.secondary} 
          textAlign="center" 
          lineHeight={20}
        >
          Upload a photo to transform it into a cartoon
        </Text>
        
        <Button
          size="$6"
          themeInverse
          onPress={pickImage}
          disabled={isLoading}
          width="100%"
          marginTop="$3"
          fontWeight="bold"
          backgroundColor={theme.tint}
          color={theme.background}
        >
          {isLoading ? (
            <XStack space="$2" alignItems="center">
              <Spinner size="small" color={theme.background} />
              <Text color={theme.background}>Processing...</Text>
            </XStack>
          ) : (
            "Upload Photo"
          )}
        </Button>
        
        {error && (
          <Text color={theme.text.error} marginTop="$2">
            {error}
          </Text>
        )}
      </YStack>
    </Card>
  );
};

export default CreateCard; 