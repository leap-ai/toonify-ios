import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Spinner } from 'tamagui';
import { Generation } from '@/components/GenerationItem';
import { formatRelativeDate } from '@/utils/dateUtils';

interface GridItemProps {
  item: Generation;
  index: number;
  itemWidth: number;
  theme: any;
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

  return (
    <View 
      style={[styles.itemContainer, { width: itemWidth }]}
    >
      <TouchableOpacity 
        onPress={() => onPress(item)}
        style={styles.imageCard}
      >
        {!imageLoaded && (
          <View style={styles.spinnerContainer}>
            <Spinner size="large" color={theme.tint} />
          </View>
        )}
        <Image 
          source={{ uri: item.cartoonImageUrl }} 
          style={[
            styles.image, 
            { 
              height: itemWidth * 1.2,
              opacity: imageLoaded ? 1 : 0.3 
            }
          ]}
          onLoad={() => setImageLoaded(true)}
        />
        <View style={[styles.dateContainer, { backgroundColor: theme.headerBackground }]}>
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
  imageCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
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
  },
  dateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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