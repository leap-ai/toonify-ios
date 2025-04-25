import React from 'react';
import { Text, XStack } from 'tamagui';
import { ChevronRight } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeProvider';

interface InfoItemProps {
  title: string;
  value?: string;
  onPress?: () => void;
  icon?: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value, onPress, icon }) => {
  const { getCurrentTheme } = useAppTheme();
  const theme = getCurrentTheme();
  
  return (
    <XStack 
      onPress={onPress}
      justifyContent="space-between" 
      alignItems="center"
      padding="$3"
      backgroundColor={theme.card}
      borderRadius="$2"
      marginVertical="$1"
    >
      <XStack space="$2" alignItems="center">
        {icon}
        <Text color={theme.text.primary}>{title}</Text>
      </XStack>
      <XStack space="$2" alignItems="center">
        {value && <Text color={theme.text.secondary}>{value}</Text>}
        {onPress && <ChevronRight size={20} color={theme.text.tertiary} />}
      </XStack>
    </XStack>
  );
};

export default InfoItem; 