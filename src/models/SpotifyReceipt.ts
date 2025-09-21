/**
 * Extended Receipt Model for Spotify Data
 * This extends the base Receipt model to include Spotify-specific data
 */

import { Receipt, ReceiptTotals, ReceiptStats, ReceiptMetadata } from './Receipt';
import { TimeRange } from './UserSession';

export interface SpotifyReceiptItem {
  id: string;
  name: string;
  artist?: string;
  artists?: Array<{ name: string }>;
  duration_ms?: number;
  duration?: number;
  playCount: number;
  price?: number;
  quantity?: number;
  trackId?: string;
  displayName?: string;
  unitPrice?: number;
  lineTotal?: number;
  album?: {
    name: string;
    images: Array<{ url: string }>;
  };
}

export interface SpotifyReceipt extends Omit<Receipt, 'items'> {
  items: SpotifyReceiptItem[];
  topTracks?: SpotifyReceiptItem[];
  totalValue?: number;
  totalDuration?: number;

  // Additional properties used by components
  storeName?: string;
  timestamp?: Date;
  total?: number;
  tax?: number;
  subtotal?: number;
  paymentMethod?: string;
  transactionId?: string;
  customerName?: string;
  theme?: any;

  // Override metadata to include all properties used by components
  metadata: ReceiptMetadata & {
    generatedAt?: Date;
    timeRange?: string;
    receiptNumber?: string;
    userId?: string;
    taxRate?: number;
  };

  // Override stats to include all properties used by components
  stats: ReceiptStats & {
    totalListeningTime?: number;
    totalPlays?: number;
    averagePlaysPerTrack?: number;
  };

  // Override totals to include taxRate
  totals: ReceiptTotals & {
    taxRate?: number;
  };
}

export function isSpotifyReceipt(receipt: any): receipt is SpotifyReceipt {
  return receipt && Array.isArray(receipt.items) && receipt.items.length > 0;
}