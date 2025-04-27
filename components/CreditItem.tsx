import React from 'react';
import { Text, XStack, Card } from 'tamagui';
import { useAppTheme } from '@/context/ThemeProvider';
import { useProductMetadataContext } from '@/context/ProductMetadataProvider';
import { CreditTransaction } from '@/types';
import { formatRelativeDate } from '@/utils/dateUtils';

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
      <Text fontSize="$3" color={theme.text.secondary} marginTop="$1">
        {formatRelativeDate(item.createdAt)}
      </Text>
    </Card>
  );
};

export default CreditItem; 