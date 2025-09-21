/**
 * Central type definitions for Spotify Receipt Generator
 */

// Re-export all model types
export type { UserSession, UserPreferences, TimeRange } from '../models/UserSession';
export type { Track } from '../models/Track';
export type { Receipt, ReceiptTotals, ReceiptStats, ReceiptMetadata } from '../models/Receipt';
export type { ReceiptItem } from '../models/ReceiptItem';
export type { Theme, ThemeColors, ThemeTerminology, ThemeFontSizes } from '../models/Theme';

// Service interfaces
export type { IAuthService, AuthResult, AuthStatus, TokenData } from '../services/auth/types';
export type { ISpotifyDataService, SpotifyTrack, UserProfile } from '../services/spotify/types';
export type { IReceiptService, PricingResult, FormattedReceipt } from '../services/receipt/types';
export type { IThemeService } from '../services/theme/types';
export type { ICanvasRenderService } from '../services/canvas/types';
export type { IExportService, ExportOptions } from '../services/export/types';

// App-wide types
export interface AppConfig {
  spotifyClientId: string;
  redirectUri: string;
  scopes: string[];
  maxTracks: number;
  pricePerPlay: number;
  taxRate: number;
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'AUTH_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

export class APIError extends AppError {
  constructor(
    message: string,
    public statusCode?: number,
    details?: any
  ) {
    super(message, 'API_ERROR', details);
    this.name = 'APIError';
  }
}

export class RenderError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'RENDER_ERROR', details);
    this.name = 'RenderError';
  }
}

// UI Component Props
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error | null;
  message?: string;
}

// Canvas types
export interface CanvasSize {
  width: number;
  height: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
  scale: number;
  format: 'png' | 'jpeg' | 'webp';
  quality?: number;
}

// Receipt formatting
export interface ReceiptLine {
  text: string;
  align?: 'left' | 'center' | 'right';
  style?: 'normal' | 'bold' | 'italic';
  size?: 'header' | 'body' | 'footer';
}

// Storage types
export interface StoredPreferences {
  theme?: string;
  timeRange?: TimeRange;
  language?: string;
  exportFormat?: 'png' | 'jpeg';
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T = void> = () => Promise<T>;
export type VoidFunction = () => void;

// Constants
export const DEFAULT_CONFIG: Partial<AppConfig> = {
  maxTracks: 25,
  pricePerPlay: 0.10,
  taxRate: 0.15,
  scopes: ['user-top-read', 'user-read-private']
};

import { TimeRange } from '../models/UserSession';

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  short_term: 'Last 4 Weeks',
  medium_term: 'Last 6 Months',
  long_term: 'All Time'
};

export const THEME_IDS = ['supermarket', 'restaurant', 'gas-station', 'pharmacy'] as const;
export type ThemeId = typeof THEME_IDS[number];