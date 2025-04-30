import React from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { YStack, H1, Paragraph, Button, XStack, Text, Image, Stack } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'tamagui/linear-gradient';
import { useAppTheme } from '@/context/ThemeProvider';

const image1Url = 'https://images.pexels.com/photos/254069/pexels-photo-254069.jpeg?cs=srgb&dl=pexels-j-carter-53083-254069.jpg&fm=jpg';
const image2Url = 'https://v3.fal.media/files/monkey/g0LvWSrfMt9FQmzG4unMn_e5f91588f6c14482ad70eea8112ddf66.png';

export default function LandingScreen() {
  const router = useRouter();
  const { getCurrentTheme, isDarkMode, activeThemeVariant, getPrimaryGradient } = useAppTheme();
  const theme = getCurrentTheme();

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={{...styles.flexContainer, backgroundColor: isDarkMode ? theme.headerBackground : theme.background}} edges={['top', 'bottom']}>
      <LinearGradient
        colors={isDarkMode ? ['$backgroundStrong', '$background'] : ['$blue3', '$blue5']}
        start={[0, 0]}
        end={[0, 1]}
        style={StyleSheet.absoluteFill} 
      />
      
      {/* Main content stack - space-between pushes top/bottom content apart */}
      <YStack flex={1} justifyContent="space-between" padding="$4" space="$5">
        
        {/* Top Image Area */}
        <XStack 
          justifyContent="center" 
          alignItems="center" 
          space="$2" 
          marginTop="$6" // Add some margin from the top
        >
          {/* First image with gradient overlay */}
          <Stack position="relative" width={180} height={300}>
            <Image
              source={{ uri: image1Url, width: 180, height: 300 }}
              borderRadius="$4"
              borderColor="$borderColor"
              borderWidth={2}
              zIndex={1}
            />
            <LinearGradient
              colors={['transparent', isDarkMode ? theme.headerBackground : theme.background]}
              start={[0, 0.4]} 
              end={[0, 1]}
              style={styles.imageGradient}
              zIndex={2}
            />
          </Stack>

          {/* Second image with gradient overlay */}
          <Stack position="relative" width={180} height={300}>
            <Image
              source={{ uri: image2Url, width: 180, height: 300 }}
              borderRadius="$4"
              borderColor="$borderColor"
              borderWidth={2}
              zIndex={1}
            />
            <LinearGradient
              colors={['transparent', isDarkMode ? theme.headerBackground : theme.background]}
              start={[0, 0.4]} 
              end={[0, 1]}
              style={styles.imageGradient}
              zIndex={2}
            />
          </Stack>
        </XStack>
          <YStack space="$3" alignItems="center">
            <H1 
              textAlign="center" 
              color={theme.text.primary}
              textShadowColor={isDarkMode ? theme.text.shadowDark : theme.text.shadowLight}
              textShadowRadius={5}
              textShadowOffset={{ width: 0, height: 1 }}
              fontWeight={400}
            >
              Welcome to
              <Text color={theme.tint}> Toonify AI</Text>
            </H1>
            <Paragraph 
              textAlign="center" 
              size="$5" 
              color={theme.text.secondary}
              paddingHorizontal="$2"
              fontWeight={400}
            >
              Turn your ideas into art in just a few taps. Explore, create, and be amazed by the power of AI.
            </Paragraph>
          </YStack>

          {/* Button Area */}
          <YStack space="$3">
            <Button 
              themeInverse 
              size="$5" 
              onPress={navigateToLogin}
              backgroundColor={theme.text.accent}
              fontWeight={500}
            >
              Get Started
            </Button>
          </YStack>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 2
  }
}); 