import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, ColorSchemeName, View, ActivityIndicator } from 'react-native';
import { Theme, ThemeName } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

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
    warning: string;
    shadowLight: string;
    shadowDark: string;
  };
  headerBackground: string;
  tabBarBackground: string;
  tabBarBorder: string;
  separator: string;
  screenBackground: string;
  overlayBackground: string;
  button: {
    primary: {
      background: string;
      text: string;
      hoverBackground: string;
      pressBackground: string;
    };
    secondary: {
      background: string;
      text: string;
      hoverBackground: string;
      pressBackground: string;
    };
    destructive: {
      background: string;
      text: string;
      hoverBackground: string;
      pressBackground: string;
    };
  };
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
          warning: '#FFA500',
          shadowLight: 'rgba(0, 0, 0, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
        },
        headerBackground: '#FFFFFF',
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#E5E5E5',
        separator: '#E5E5E5',
        screenBackground: '#F9F9F9',
        overlayBackground: 'rgba(0, 0, 0, 0.6)',
        button: {
          primary: {
            background: '#007AFF',
            text: '#FFFFFF',
            hoverBackground: '#005ECB',
            pressBackground: '#004AAD'
          },
          secondary: {
            background: '#E5E5E5',
            text: '#000000',
            hoverBackground: '#D4D4D4',
            pressBackground: '#C3C3C3'
          },
          destructive: {
            background: '#FF3B30',
            text: '#FFFFFF',
            hoverBackground: '#D9352B',
            pressBackground: '#C33026'
          },
        },
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
          warning: '#FFB733',
          shadowLight: 'rgba(0, 0, 0, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
        },
        headerBackground: '#1A1A1A',
        tabBarBackground: '#1A1A1A',
        tabBarBorder: '#333333',
        separator: '#333333',
        screenBackground: '#121212',
        overlayBackground: 'rgba(0, 0, 0, 0.8)',
        button: {
          primary: {
            background: '#0A84FF',
            text: '#FFFFFF',
            hoverBackground: '#006AE5',
            pressBackground: '#0057B7'
          },
          secondary: {
            background: '#3A3A3C',
            text: '#FFFFFF',
            hoverBackground: '#48484A',
            pressBackground: '#565658'
          },
          destructive: {
            background: '#FF453A',
            text: '#FFFFFF',
            hoverBackground: '#E03B30',
            pressBackground: '#C7342A'
          },
        },
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
          warning: '#FFA500',
          shadowLight: 'rgba(0, 0, 0, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
        },
        headerBackground: '#FFFFFF',
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#EFEFEF',
        separator: '#EFEFEF',
        screenBackground: '#FCFAFF',
        overlayBackground: 'rgba(40, 20, 60, 0.6)',
        button: {
          primary: {
            background: '#8A2BE2',
            text: '#FFFFFF',
            hoverBackground: '#751EC0',
            pressBackground: '#6113A0'
          },
          secondary: {
            background: '#E5DCFF',
            text: '#1A1A1A',
            hoverBackground: '#D4C5F5',
            pressBackground: '#C3AFEB'
          },
          destructive: {
            background: '#E02020',
            text: '#FFFFFF',
            hoverBackground: '#C01A1A',
            pressBackground: '#A01414'
          },
        },
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
          warning: '#FFB733',
          shadowLight: 'rgba(0, 0, 0, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
        },
        headerBackground: '#1E1930',
        tabBarBackground: '#1E1930',
        tabBarBorder: '#392D4D',
        separator: '#392D4D',
        screenBackground: '#121212',
        overlayBackground: 'rgba(20, 10, 30, 0.8)',
        button: {
          primary: {
            background: '#A55EEA',
            text: '#FFFFFF',
            hoverBackground: '#8E47D0',
            pressBackground: '#7730B6'
          },
          secondary: {
            background: '#392D4D',
            text: '#FFFFFF',
            hoverBackground: '#4A3A60',
            pressBackground: '#5B4773'
          },
          destructive: {
            background: '#FF6B6B',
            text: '#121212',
            hoverBackground: '#E05252',
            pressBackground: '#C74040'
          },
        },
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
          warning: '#FFA500',
          shadowLight: 'rgba(0, 0, 0, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
        },
        headerBackground: '#FFFFFF',
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#EFEFEF',
        separator: '#EFEFEF',
        screenBackground: '#FFFAF5',
        overlayBackground: 'rgba(60, 30, 10, 0.6)',
        button: {
          primary: {
            background: '#FF8C00',
            text: '#FFFFFF',
            hoverBackground: '#D97800',
            pressBackground: '#B36200'
          },
          secondary: {
            background: '#FFE0C0',
            text: '#2D2D2D',
            hoverBackground: '#FFD4A8',
            pressBackground: '#FFC890'
          },
          destructive: {
            background: '#E54D4D',
            text: '#FFFFFF',
            hoverBackground: '#C93C3C',
            pressBackground: '#AD2B2B'
          },
        },
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
          warning: '#FFB733',
          shadowLight: 'rgba(0, 0, 0, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
        },
        headerBackground: '#241F1A',
        tabBarBackground: '#241F1A',
        tabBarBorder: '#4D3F33',
        separator: '#4D3F33',
        screenBackground: '#121212',
        overlayBackground: 'rgba(40, 20, 5, 0.8)',
        button: {
          primary: {
            background: '#FF9F43',
            text: '#121212',
            hoverBackground: '#E08A30',
            pressBackground: '#C2751D'
          },
          secondary: {
            background: '#4D3F33',
            text: '#FFFFFF',
            hoverBackground: '#604E40',
            pressBackground: '#735D4D'
          },
          destructive: {
            background: '#FF6B6B',
            text: '#121212',
            hoverBackground: '#E05252',
            pressBackground: '#C74040'
          },
        },
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
          warning: '#FFA500',
          shadowLight: 'rgba(0, 0, 0, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
        },
        headerBackground: '#FFFFFF',
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#EFEFEF',
        separator: '#EFEFEF',
        screenBackground: '#F7FCFD',
        overlayBackground: 'rgba(10, 40, 60, 0.6)',
        button: {
          primary: {
            background: '#0077B6',
            text: '#FFFFFF',
            hoverBackground: '#0090D8',
            pressBackground: '#0080C2'
          },
          secondary: {
            background: '#90E0EF',
            text: '#000000',
            hoverBackground: '#A0E8F0',
            pressBackground: '#80D8E0'
          },
          destructive: {
            background: '#F87171',
            text: '#FFFFFF',
            hoverBackground: '#FF8080',
            pressBackground: '#E06060'
          },
        },
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
          warning: '#FFA500',
          shadowLight: 'rgba(0, 0, 0, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
        },
        headerBackground: '#162229',
        tabBarBackground: '#162229',
        tabBarBorder: '#2D4652',
        separator: '#2D4652',
        screenBackground: '#121212',
        overlayBackground: 'rgba(5, 20, 30, 0.8)',
        button: {
          primary: {
            background: '#22D3EE',
            text: '#FFFFFF',
            hoverBackground: '#40E0F0',
            pressBackground: '#30D0E0'
          },
          secondary: {
            background: '#90E0EF',
            text: '#000000',
            hoverBackground: '#A0E8F0',
            pressBackground: '#80D8E0'
          },
          destructive: {
            background: '#F87171',
            text: '#FFFFFF',
            hoverBackground: '#FF8080',
            pressBackground: '#E06060'
          },
        },
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

// --- Storage Key ---
const THEME_STORAGE_KEY = 'app_theme_preference_key';
const DEFAULT_THEME_ID = 'default'; // ID for "Classic Blue"

// Define the context type
interface ThemeContextType {
  activeThemeVariant: ThemeVariant;
  isDarkMode: boolean;
  systemColorScheme: ColorSchemeName;
  setActiveThemeVariant: (themeId: string) => void;
  getCurrentTheme: () => ThemeColors;
  getPrimaryGradient: (props?: any) => React.ReactNode;
  getSecondaryGradient: (props?: any) => React.ReactNode;
  getCardGradient: (props?: any) => React.ReactNode;
  isThemeLoaded: boolean; // Add loading state to context
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [activeThemeVariant, _setActiveThemeVariant] = useState<ThemeVariant>(themeVariants.find(t => t.id === DEFAULT_THEME_ID) || themeVariants[0]); // Initial default
  const [isThemeLoaded, setIsThemeLoaded] = useState(false); // Loading state

  // Handle system color scheme changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Load theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeId = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        const initialThemeId = savedThemeId || DEFAULT_THEME_ID;
        const theme = themeVariants.find(t => t.id === initialThemeId) || themeVariants.find(t => t.id === DEFAULT_THEME_ID) || themeVariants[0];
        _setActiveThemeVariant(theme);
      } catch (error) {
        console.error("Failed to load theme preference:", error);
        // Fallback to default if loading fails
        const theme = themeVariants.find(t => t.id === DEFAULT_THEME_ID) || themeVariants[0];
        _setActiveThemeVariant(theme);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    loadThemePreference();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to set the active theme variant AND save preference
  const setActiveThemeVariant = async (themeId: string) => {
    const newTheme = themeVariants.find(t => t.id === themeId);
    if (newTheme) {
      _setActiveThemeVariant(newTheme);
      try {
        await SecureStore.setItemAsync(THEME_STORAGE_KEY, themeId);
      } catch (error) {
        console.error("Failed to save theme preference:", error);
        // Handle saving error if needed (e.g., show a message)
      }
    } else {
        console.warn(`Theme with id "${themeId}" not found.`);
    }
  };

  // Function to get the current theme colors based on mode
  const getCurrentTheme = (): ThemeColors => {
    return activeThemeVariant.colors[isDarkMode ? 'dark' : 'light'];
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

  // Render loading state until theme is loaded from storage
  if (!isThemeLoaded) {
    // You can customize this loading state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: systemColorScheme === 'dark' ? '#121212' : '#FFFFFF' }}>
        <ActivityIndicator size="large" color={systemColorScheme === 'dark' ? '#FFFFFF' : '#000000'} />
      </View>
    );
  }

  // Provide the context value
  const contextValue: ThemeContextType = {
    activeThemeVariant,
    isDarkMode,
    systemColorScheme,
    setActiveThemeVariant, // Expose the updated function
    getCurrentTheme,
    getPrimaryGradient,
    getSecondaryGradient,
    getCardGradient,
    isThemeLoaded, // Expose loading state
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Apply Tamagui theme based on active variant, casting to ThemeName */}
      <Theme name={(isDarkMode ? `${activeThemeVariant.id}_dark` : `${activeThemeVariant.id}_light`) as ThemeName}>
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

// Function to get all theme variants (unchanged)
export const getThemeVariants = () => themeVariants; 