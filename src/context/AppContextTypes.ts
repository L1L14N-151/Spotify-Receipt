export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
export type Theme = 'cvs' | 'casino' | 'breakingbad' | 'nasa' | 'carrefour' |
                    'matrix' | 'mcdonalds' | 'gaming' | 'polaroid' | 'github';

export interface AuthState {
  isAuthenticated: boolean;
  accessToken?: string;
  expiresAt?: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  popularity: number;
}

export interface Receipt {
  id: string;
  storeName: string;
  timestamp: Date;
  items: ReceiptItem[];
  total: number;
  tax: number;
  subtotal: number;
  paymentMethod: string;
  transactionId: string;
  customerName?: string;
  theme: Theme;
  metadata?: Record<string, any>;
}

export interface ReceiptItem {
  name: string;
  artist: string;
  price: number;
  quantity: number;
  duration?: string;
  plays?: number;
}

export interface AppState {
  auth: AuthState;
  tracks: SpotifyTrack[];
  theme: Theme;
  timeRange: TimeRange;
  receipt: Receipt | null;
}

export type AppAction =
  | { type: 'SET_AUTH'; payload: AuthState }
  | { type: 'SET_TRACKS'; payload: SpotifyTrack[] }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_TIME_RANGE'; payload: TimeRange }
  | { type: 'SET_RECEIPT'; payload: Receipt | null }
  | { type: 'LOGOUT' };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}