import React, { useEffect, useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGenerationStore } from '@/stores/generation';
import { ArrowLeft } from 'lucide-react-native';
import { 
  Text, 
  Button, 
  YStack, 
  XStack, 
  Card, 
  Spinner, 
  H4
} from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { Generation } from '@/components/GenerationItem';
import { GridItem } from '@/components/GridItem';
import { ImageDetailsModal } from '@/components/ImageDetailsModal';

// Grid layout configuration
const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
// Calculate width to ensure even spacing on both sides
const CONTAINER_PADDING = SPACING;
const ITEM_WIDTH = (width - (2 * CONTAINER_PADDING) - (SPACING * (COLUMN_COUNT - 1))) / COLUMN_COUNT;

export default function HistoryScreen() {
  const router = useRouter();
  const { generations, fetchGenerations, isLoading: isGenerationsLoading } = useGenerationStore();
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  const [selectedItem, setSelectedItem] = useState<Generation | null>(null);

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  const handleItemPress = (item: Generation) => {
    setSelectedItem(item);
  };

  const renderItem = ({ item, index }: { item: Generation; index: number }) => (
    <GridItem
      item={item}
      index={index}
      itemWidth={ITEM_WIDTH}
      theme={theme}
      onPress={() => handleItemPress(item)}
    />
  );

  if (isGenerationsLoading) {
    return (
      <YStack 
        flex={1} 
        justifyContent="center" 
        alignItems="center"
        backgroundColor={theme.screenBackground}
      >
        <Spinner size="large" color={theme.tint} />
        <Text marginTop="$2" color={theme.text.secondary}>Loading your cartoons...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor={theme.screenBackground}>
      <XStack 
        padding="$3" 
        alignItems="center" 
        borderBottomColor={theme.separator} 
        borderBottomWidth={1}
        backgroundColor={theme.headerBackground}
      >
        <Button 
          icon={<ArrowLeft size={20} color={theme.text.primary} />} 
          onPress={() => router.back()} 
          chromeless
          marginRight="$2"
        />
        <H4 color={theme.text.primary} fontWeight="bold">Your Cartoons</H4>
      </XStack>
      
      {generations.length === 0 ? (
        <YStack padding="$3" flex={1} justifyContent="center">
          <Card 
            padding="$5" 
            bordered 
            alignItems="center"
            backgroundColor={theme.card}
            borderColor={theme.cardBorder}
          >
            <Text 
              fontSize="$3" 
              color={theme.text.secondary} 
              marginBottom="$4" 
              textAlign="center"
            >
              No cartoons generated yet
            </Text>
            <Button
              themeInverse
              size="$4"
              onPress={() => router.push('/')}
              fontWeight="bold"
              backgroundColor={theme.tint}
              color={theme.background}
            >
              Generate Your First Cartoon
            </Button>
          </Card>
        </YStack>
      ) : (
        <FlatList
          data={generations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.gridContainer}
          numColumns={COLUMN_COUNT}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      <ImageDetailsModal
        isVisible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: SPACING,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING,
  }
}); 