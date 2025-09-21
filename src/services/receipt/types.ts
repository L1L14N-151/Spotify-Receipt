import { SpotifyTrack, TimeRange } from '../spotify/types';
import { SpotifyReceipt } from '../../models/SpotifyReceipt';

export interface IReceiptService {
  generateReceipt(tracks: SpotifyTrack[], theme: Theme, timeRange: TimeRange): SpotifyReceipt;
  calculatePricing(tracks: SpotifyTrack[]): PricingResult;
  generateStats(tracks: SpotifyTrack[]): ReceiptStats;
  formatReceipt(receipt: Receipt): FormattedReceipt;
}

export interface Receipt {
  id: string;
  generatedAt: Date;
  timeRange: TimeRange;
  theme: Theme;
  items: ReceiptItem[];
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
  stats: ReceiptStats;
  metadata?: any;
}

export interface ReceiptItem {
  trackId: string;
  displayName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PricingResult {
  items: Array<{
    trackId: string;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}

export interface ReceiptStats {
  totalHours: number;
  guiltyPleasure: {
    track: string;
    hours: number;
  };
  receiptNumber: string;
  cashierName: string;
}

export interface FormattedReceipt {
  header: string[];
  items: string[];
  totals: string[];
  footer: string[];
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  terminology: ThemeTerminology;
  fontFamily: string;
  fontSize: {
    header: number;
    body: number;
    footer: number;
  };
}

export interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  paper: string;
  shadow?: string;
}

export interface ThemeTerminology {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  cashier: string;
  subtotalLabel: string;
  taxLabel: string;
  totalLabel: string;
  paymentMethod: string;
  thankYouMessage: string;
  wastedTimeMessage: string;
}