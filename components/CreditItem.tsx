import React from 'react';
import { Text, XStack, Card } from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { useProductMetadataContext } from '@/context/ProductMetadataProvider';
import { CreditTransaction } from '@/types';

interface CreditItemProps {
  item: CreditTransaction;
}

const CreditItem: React.FC<CreditItemProps> = ({ item }) => {
  const { metadataMap } = useProductMetadataContext();
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  
  const getDisplayName = () => {
    if (item.type === 'payment') {
      return 'External Payment';
    }
    // Try to get the product name from metadata
    const productId = item.type || '';
    const metadata = metadataMap[productId];
    
    if (metadata?.name) {
      return `Purchased ${metadata.name}`;
    }
    return 'External Payment';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
    if (diffDays === 0) {
      if (diffHours === 0) {
        if (diffMinutes < 1) {
          return 'Just now';
        }
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <Card 
      marginVertical="$1" 
      padding="$3" 
      bordered
      backgroundColor={theme.card}
      borderColor={theme.cardBorder}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold" color={theme.text.primary}>{getDisplayName()}</Text>
        <Text 
          color={item.amount > 0 ? theme.text.success : theme.text.secondary}
          fontWeight="bold"
        >
          {item.amount > 0 ? '+' : ''}{item.amount} {item.currency}
        </Text>
      </XStack>
      <Text fontSize="$2" color={theme.text.secondary} marginTop="$1">
        {formatDate(item.createdAt)}
      </Text>
    </Card>
  );
};

export default CreditItem; 