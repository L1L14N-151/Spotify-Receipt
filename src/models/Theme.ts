/**
 * Theme Model
 * Represents a receipt visual theme
 */

export interface Theme {
  id: string;                // Theme identifier
  name: string;              // Display name
  colors: ThemeColors;       // Color scheme
  terminology: ThemeTerminology; // Text variations
  fontFamily: string;        // CSS font-family value
  fontSize: ThemeFontSizes;  // Font sizes for sections
}

export interface ThemeColors {
  background: string;        // Receipt background
  text: string;              // Main text color
  accent: string;            // Decorative elements
  paper: string;             // Paper texture color
  shadow?: string;           // Optional shadow color
}

export interface ThemeTerminology {
  storeName: string;         // e.g., "SPOTIFY SUPERMARKET"
  storeAddress: string;      // e.g., "123 Music Street"
  storePhone: string;        // e.g., "555-MUSIC-01"
  cashier: string;           // e.g., "DJ-BOT"
  subtotalLabel: string;     // e.g., "SUBTOTAL"
  taxLabel: string;          // e.g., "ADDICTION TAX"
  totalLabel: string;        // e.g., "TOTAL"
  paymentMethod: string;     // e.g., "CARD ****4242"
  thankYouMessage: string;   // e.g., "Thank you for shopping"
  wastedTimeMessage: string; // e.g., "You wasted X hours"
}

export interface ThemeFontSizes {
  header: number;            // Header text size
  body: number;              // Body text size
  footer: number;            // Footer text size
}

/**
 * Predefined themes
 */
export const THEMES: Record<string, Theme> = {
  supermarket: {
    id: 'supermarket',
    name: 'Supermarket',
    colors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#ff0000',
      paper: '#f8f8f8',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    terminology: {
      storeName: 'SPOTIFY SUPERMARKET',
      storeAddress: '123 Music Street',
      storePhone: 'Tel: 555-MUSIC-01',
      cashier: 'DJ-BOT',
      subtotalLabel: 'SUBTOTAL',
      taxLabel: 'ADDICTION TAX',
      totalLabel: 'TOTAL',
      paymentMethod: 'CARD ****4242 APPROVED',
      thankYouMessage: 'Thank you for shopping at\n    SPOTIFY MARKET',
      wastedTimeMessage: 'You wasted {hours}hrs this month'
    },
    fontFamily: '"Courier New", "Lucida Console", monospace',
    fontSize: {
      header: 14,
      body: 12,
      footer: 10
    }
  },

  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    colors: {
      background: '#fffef5',
      text: '#1a1a1a',
      accent: '#8b4513',
      paper: '#faf8f0',
      shadow: 'rgba(139, 69, 19, 0.1)'
    },
    terminology: {
      storeName: 'CAFÉ SPOTIFY',
      storeAddress: '456 Melody Avenue',
      storePhone: 'Reservations: 555-TUNE-02',
      cashier: 'SERVER: ALEX',
      subtotalLabel: 'SUBTOTAL',
      taxLabel: 'SERVICE CHARGE',
      totalLabel: 'TOTAL DUE',
      paymentMethod: 'VISA ****4242',
      thankYouMessage: 'Thank you for dining with us\n    Please come again!',
      wastedTimeMessage: 'Table time: {hours} hours'
    },
    fontFamily: '"Georgia", "Times New Roman", serif',
    fontSize: {
      header: 15,
      body: 13,
      footer: 11
    }
  },

  'gas-station': {
    id: 'gas-station',
    name: 'Gas Station',
    colors: {
      background: '#f0f0f0',
      text: '#003366',
      accent: '#ff6600',
      paper: '#e8e8e8',
      shadow: 'rgba(0, 51, 102, 0.15)'
    },
    terminology: {
      storeName: 'SPOTIFY FUEL STOP',
      storeAddress: 'Highway 808, Exit 33',
      storePhone: '24HR: 555-FUEL-03',
      cashier: 'PUMP: 04',
      subtotalLabel: 'FUEL TOTAL',
      taxLabel: 'STATE TAX',
      totalLabel: 'AMOUNT DUE',
      paymentMethod: 'CREDIT ****4242',
      thankYouMessage: 'Thank you for choosing\n    SPOTIFY FUEL',
      wastedTimeMessage: 'Gallons of time: {hours}hrs'
    },
    fontFamily: '"Arial", "Helvetica", sans-serif',
    fontSize: {
      header: 14,
      body: 12,
      footer: 10
    }
  },

  pharmacy: {
    id: 'pharmacy',
    name: 'Pharmacy',
    colors: {
      background: '#ffffff',
      text: '#005500',
      accent: '#00aa00',
      paper: '#f5fff5',
      shadow: 'rgba(0, 85, 0, 0.1)'
    },
    terminology: {
      storeName: 'SPOTIFY PHARMACY',
      storeAddress: '789 Rhythm Road',
      storePhone: 'RX: 555-MEDS-04',
      cashier: 'RPh: DR. BEAT',
      subtotalLabel: 'PRESCRIPTION TOTAL',
      taxLabel: 'DISPENSING FEE',
      totalLabel: 'TOTAL',
      paymentMethod: 'INSURANCE + COPAY',
      thankYouMessage: 'Be well!\n    SPOTIFY PHARMACY',
      wastedTimeMessage: 'Dosage: {hours}hrs daily'
    },
    fontFamily: '"Consolas", "Monaco", monospace',
    fontSize: {
      header: 13,
      body: 11,
      footer: 9
    }
  },

  carrefour: {
    id: 'carrefour',
    name: 'Carrefour',
    colors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#0047BB',
      paper: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    terminology: {
      storeName: 'CARREFOUR MARKET',
      storeAddress: 'Centre Commercial',
      storePhone: 'Tel: 01 42 00 00 00',
      cashier: 'Caisse 04',
      subtotalLabel: 'SOUS-TOTAL',
      taxLabel: 'TVA 20%',
      totalLabel: 'TOTAL',
      paymentMethod: 'CB ************4242',
      thankYouMessage: 'Merci de votre visite\nA bientôt',
      wastedTimeMessage: 'Temps passé: {hours}hrs'
    },
    fontFamily: '"Courier New", monospace',
    fontSize: {
      header: 14,
      body: 11,
      footer: 10
    }
  }
};

/**
 * Gets a theme by ID
 */
export function getTheme(themeId: string): Theme | null {
  return THEMES[themeId] || null;
}

/**
 * Gets all available themes
 */
export function getAllThemes(): Theme[] {
  return Object.values(THEMES);
}

/**
 * Gets the default theme
 */
export function getDefaultTheme(): Theme {
  return THEMES.supermarket;
}

/**
 * Validates a theme object
 */
export function validateTheme(theme: any): theme is Theme {
  return (
    typeof theme.id === 'string' &&
    typeof theme.name === 'string' &&
    typeof theme.colors === 'object' &&
    typeof theme.terminology === 'object' &&
    typeof theme.fontFamily === 'string' &&
    typeof theme.fontSize === 'object'
  );
}

/**
 * Applies theme-specific formatting to text
 */
export function applyThemeFormatting(text: string, theme: Theme): string {
  // Replace placeholders with theme-specific values
  return text
    .replace('{storeName}', theme.terminology.storeName)
    .replace('{cashier}', theme.terminology.cashier)
    .replace('{phone}', theme.terminology.storePhone);
}

/**
 * Gets CSS variables for a theme
 */
export function getThemeCSSVariables(theme: Theme): Record<string, string> {
  return {
    '--theme-bg': theme.colors.background,
    '--theme-text': theme.colors.text,
    '--theme-accent': theme.colors.accent,
    '--theme-paper': theme.colors.paper,
    '--theme-shadow': theme.colors.shadow || 'rgba(0, 0, 0, 0.1)',
    '--theme-font': theme.fontFamily,
    '--theme-font-header': `${theme.fontSize.header}px`,
    '--theme-font-body': `${theme.fontSize.body}px`,
    '--theme-font-footer': `${theme.fontSize.footer}px`
  };
}