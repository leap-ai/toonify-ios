import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { Theme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';

// Define theme interfaces
export interface ThemeColors {
  tint: string;
  background: string;
  card: string;
  cardBorder: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    error: string;
    success: string;
  };
  headerBackground: string;
  tabBarBackground: string;
  tabBarBorder: string;
  separator: string;
  screenBackground: string;
}

export interface GradientConfig {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export interface FontConfig {
  body: string;
  heading: string;
  display: string;
}

// Theme variant interface
export interface ThemeVariant {
  id: string;
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  fonts: FontConfig;
  gradients: {
    primary: GradientConfig;
    secondary: GradientConfig;
    card: GradientConfig;
  };
}

// Define theme variants
export const themeVariants: ThemeVariant[] = [
  {
    id: 'default',
    name: 'Classic Blue',
    colors: {
      light: {
        tint: '#007AFF',
        background: '#FFFFFF',
        card: '#F5F5F5',
        cardBorder: '#E0E0E0',
        text: {
          primary: '#000000',
          secondary: '#666666',
          tertiary: '#999999',
          accent: '#007AFF',
          error: '#FF3B30',
          success: '#34C759',
        },
        headerBackground: '#FFFFFF',
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#E5E5E5',
        separator: '#E5E5E5',
        screenBackground: '#F9F9F9',
      },
      dark: {
        tint: '#0A84FF',
        background: '#121212',
        card: '#1E1E1E',
        cardBorder: '#333333',
        text: {
          primary: '#FFFFFF',
          secondary: '#BBBBBB',
          tertiary: '#888888',
          accent: '#0A84FF',
          error: '#FF453A',
          success: '#30D158',
        },
        headerBackground: '#1A1A1A',
        tabBarBackground: '#1A1A1A',
        tabBarBorder: '#333333',
        separator: '#333333',
        screenBackground: '#121212',
      },
    },
    fonts: {
      body: 'System',
      heading: 'System',
      display: 'System',
    },
    gradients: {
      primary: {
        colors: ['#007AFF', '#34C759'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      secondary: {
        colors: ['#5856D6', '#FF2D55'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      card: {
        colors: ['#F8F8F8', '#FFFFFF'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
      },
    },
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      light: {
        tint: '#8A2BE2',
        background: '#FFFFFF',
        card: '#F8F5FF',
        cardBorder: '#E5DCFF',
        text: {
          primary: '#1A1A1A',
          secondary: '#555555',
          tertiary: '#888888',
          accent: '#9D50BB',
          error: '#E02020',
          success: '#28C76F',
        },
        headerBackground: '#FFFFFF',
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#EFEFEF',
        separator: '#EFEFEF',
        screenBackground: '#FCFAFF',
      },
      dark: {
        tint: '#A55EEA',
        background: '#121212',
        card: '#231C30',
        cardBorder: '#392D4D',
        text: {
          primary: '#FFFFFF',
          secondary: '#CDCDCD',
          tertiary: '#9A9A9A',
          accent: '#A55EEA',
          error: '#FF6B6B',
          success: '#39DA8A',
        },
        headerBackground: '#1E1930',
        tabBarBackground: '#1E1930',
        tabBarBorder: '#392D4D',
        separator: '#392D4D',
        screenBackground: '#121212',
      },
    },
    fonts: {
      body: 'Poppins',
      heading: 'Poppins',
      display: 'Poppins',
    },
    gradients: {
      primary: {
        colors: ['#8A2BE2', '#9D50BB'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      secondary: {
        colors: ['#6B33AF', '#C86DD7'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      card: {
        colors: ['#F8F5FF', '#FFFFFF'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
      },
    },
  },
  {
    id: 'sunset',
    name: 'Warm Sunset',
    colors: {
      light: {
        tint: '#FF8C00',
        background: '#FFFFFF',
        card: '#FFF8F0',
        cardBorder: '#FFE0C0',
        text: {
          primary: '#2D2D2D',
          secondary: '#6D6D6D',
          tertiary: '#9D9D9D',
          accent: '#FF8C00',
          error: '#E54D4D',
          success: '#48C774',
        },
        headerBackground: '#FFFFFF',
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#EFEFEF',
        separator: '#EFEFEF',
        screenBackground: '#FFFAF5',
      },
      dark: {
        tint: '#FF9F43',
        background: '#121212',
        card: '#2C2420',
        cardBorder: '#4D3F33',
        text: {
          primary: '#FFFFFF',
          secondary: '#CDCDCD',
          tertiary: '#9A9A9A',
          accent: '#FF9F43',
          error: '#FF6B6B',
          success: '#39DA8A',
        },
        headerBackground: '#241F1A',
        tabBarBackground: '#241F1A',
        tabBarBorder: '#4D3F33',
        separator: '#4D3F33',
        screenBackground: '#121212',
      },
    },
    fonts: {
      body: 'Roboto',
      heading: 'Montserrat',
      display: 'Montserrat',
    },
    gradients: {
      primary: {
        colors: ['#FF8C00', '#FF5050'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      secondary: {
        colors: ['#FFB300', '#FF6B6B'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      card: {
        colors: ['#FFF9F0', '#FFFFFF'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
      },
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    colors: {
      light: {
        tint: '#00B4D8',
        background: '#FFFFFF',
        card: '#F0F9FC',
        cardBorder: '#DAEDF2',
        text: {
          primary: '#252525',
          secondary: '#606060',
          tertiary: '#909090',
          accent: '#00B4D8',
          error: '#EF4444',
          success: '#10B981',
        },
        headerBackground: '#FFFFFF',
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#EFEFEF',
        separator: '#EFEFEF',
        screenBackground: '#F7FCFD',
      },
      dark: {
        tint: '#22D3EE',
        background: '#121212',
        card: '#1A2A32',
        cardBorder: '#2D4652',
        text: {
          primary: '#FFFFFF',
          secondary: '#CDCDCD',
          tertiary: '#9A9A9A',
          accent: '#22D3EE',
          error: '#F87171',
          success: '#34D399',
        },
        headerBackground: '#162229',
        tabBarBackground: '#162229',
        tabBarBorder: '#2D4652',
        separator: '#2D4652',
        screenBackground: '#121212',
      },
    },
    fonts: {
      body: 'Inter',
      heading: 'Inter',
      display: 'Inter',
    },
    gradients: {
      primary: {
        colors: ['#0077B6', '#00B4D8'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      secondary: {
        colors: ['#90E0EF', '#0077B6'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      card: {
        colors: ['#F0F9FC', '#FFFFFF'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
      },
    },
  },
];

// Theme Context
interface ThemeContextType {
  activeThemeVariant: ThemeVariant;
  isDarkMode: boolean;
  systemColorScheme: ColorSchemeName;
  setActiveThemeVariant: (themeId: string) => void;
  getCurrentTheme: () => ThemeColors;
  getPrimaryGradient: (props?: any) => React.ReactNode;
  getSecondaryGradient: (props?: any) => React.ReactNode;
  getCardGradient: (props?: any) => React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [activeThemeVariantId, setActiveThemeVariantId] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const activeThemeVariant = themeVariants.find(theme => theme.id === activeThemeVariantId) || themeVariants[0];

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const setActiveThemeVariant = (themeId: string) => {
    const themeExists = themeVariants.some(theme => theme.id === themeId);
    if (themeExists) {
      setActiveThemeVariantId(themeId);
    }
  };

  const getCurrentTheme = (): ThemeColors => {
    return isDarkMode ? activeThemeVariant.colors.dark : activeThemeVariant.colors.light;
  };

  const getPrimaryGradient = (props: any = {}) => {
    const { colors, start, end } = activeThemeVariant.gradients.primary;
    return (
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        {...props}
      />
    );
  };

  const getSecondaryGradient = (props: any = {}) => {
    const { colors, start, end } = activeThemeVariant.gradients.secondary;
    return (
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        {...props}
      />
    );
  };

  const getCardGradient = (props: any = {}) => {
    const { colors, start, end } = activeThemeVariant.gradients.card;
    return (
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        {...props}
      />
    );
  };

  const value: ThemeContextType = {
    activeThemeVariant,
    isDarkMode,
    systemColorScheme,
    setActiveThemeVariant,
    getCurrentTheme,
    getPrimaryGradient,
    getSecondaryGradient,
    getCardGradient,
  };

  const tamaguiTheme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={value}>
      <Theme name={tamaguiTheme}>
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export the theme variants directly
export const getThemeVariants = () => themeVariants; 