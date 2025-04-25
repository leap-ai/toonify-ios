import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, XStack, YStack, H4 } from 'tamagui';
import { useAppTheme, themeVariants, ThemeVariant } from '../context/ThemeProvider';
import { CheckCircle2 } from 'lucide-react-native';

interface ThemeSelectorProps {
  onClose?: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { activeThemeVariant, setActiveThemeVariant, isDarkMode } = useAppTheme();
  const currentTheme = isDarkMode ? 'dark' : 'light';

  const handleThemeSelect = (themeId: string) => {
    setActiveThemeVariant(themeId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <YStack padding="$3" space="$3">
      <H4>Select Theme</H4>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack space="$3" padding="$1">
          {themeVariants.map((theme) => (
            <ThemeOption
              key={theme.id}
              theme={theme}
              isSelected={theme.id === activeThemeVariant.id}
              onSelect={handleThemeSelect}
              currentMode={currentTheme}
            />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
};

interface ThemeOptionProps {
  theme: ThemeVariant;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
  currentMode: 'light' | 'dark';
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  theme,
  isSelected,
  onSelect,
  currentMode,
}) => {
  const colors = theme.colors[currentMode];
  
  return (
    <TouchableOpacity 
      style={styles.themeOption}
      onPress={() => onSelect(theme.id)}
      activeOpacity={0.7}
    >
      <Card
        bordered
        elevate
        size="$4"
        width={130}
        height={180}
        backgroundColor={colors.card}
        borderColor={colors.cardBorder}
        borderWidth={isSelected ? 2 : 1}
        overflow="hidden"
      >
        <Card.Header paddingTop="$2" paddingHorizontal="$2">
          <Text 
            fontSize="$3" 
            fontWeight="bold" 
            color={colors.text.primary}
            numberOfLines={1}
          >
            {theme.name}
          </Text>
        </Card.Header>
        
        <YStack flex={1} space="$2" padding="$2">
          {/* Color swatches */}
          <View style={[styles.colorSwatch, { backgroundColor: colors.tint }]} />
          <XStack space="$1">
            <View style={[styles.colorSwatchSmall, { backgroundColor: colors.text.primary }]} />
            <View style={[styles.colorSwatchSmall, { backgroundColor: colors.text.accent }]} />
            <View style={[styles.colorSwatchSmall, { backgroundColor: colors.text.secondary }]} />
          </XStack>
          
          {/* Example UI */}
          <View style={[styles.exampleUI, { backgroundColor: colors.background }]}>
            <View style={[styles.exampleUIHeader, { backgroundColor: colors.headerBackground }]} />
            <View style={[styles.exampleUIContent, { backgroundColor: colors.card }]} />
          </View>
          
          {/* Font name display */}
          <Text 
            fontSize="$1" 
            color={colors.text.secondary}
            numberOfLines={1}
          >
            {theme.fonts.body}
          </Text>
        </YStack>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <CheckCircle2 size={20} color={colors.tint} />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  themeOption: {
    marginRight: 5,
  },
  colorSwatch: {
    height: 20,
    borderRadius: 4,
  },
  colorSwatchSmall: {
    flex: 1,
    height: 12,
    borderRadius: 2,
  },
  exampleUI: {
    height: 50,
    borderRadius: 4,
    overflow: 'hidden',
  },
  exampleUIHeader: {
    height: 10,
  },
  exampleUIContent: {
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default ThemeSelector; 