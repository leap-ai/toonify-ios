import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Spinner } from 'tamagui';
import { Generation } from '@/components/GenerationItem';
import { formatRelativeDate } from '@/utils/dateUtils';
import { ThemeColors } from '@/context/ThemeProvider';

interface GridItemProps {
  item: Generation;
  index: number;
  itemWidth: number;
  theme: ThemeColors;
  onPress: (item: Generation) => void;
}

export const GridItem = ({ 
  item, 
  index, 
  itemWidth, 
  theme, 
  onPress 
}: GridItemProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const dynamicStyles = StyleSheet.create({
    imageCard: {
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      position: 'relative',
    },
    image: {
      width: '100%',
      borderRadius: 12,
      height: itemWidth * 1.2,
      opacity: imageLoaded ? 1 : 0.3,
    },
    dateContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      backgroundColor: theme.headerBackground,
    },
    spinnerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
  });

  return (
    <View 
      style={[styles.itemContainer, { width: itemWidth }]}
    >
      <TouchableOpacity 
        onPress={() => onPress(item)}
        style={dynamicStyles.imageCard}
      >
        {!imageLoaded && (
          <View style={dynamicStyles.spinnerContainer}>
            <Spinner size="large" color={theme.tint} />
          </View>
        )}
        <Image 
          source={{ uri: item.cartoonImageUrl }} 
          style={dynamicStyles.image}
          onLoad={() => setImageLoaded(true)}
        />
        <View style={dynamicStyles.dateContainer}>
          <Text color={theme.text.secondary} fontSize="$3" fontWeight="500">
            {formatRelativeDate(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    margin: 0,
  },
}); 