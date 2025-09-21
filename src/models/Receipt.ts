/**
 * Receipt Model
 * Represents a generated receipt visualization
 */

import { Track } from './Track';
import { Theme } from './Theme';
import { ReceiptItem } from './ReceiptItem';
import { TimeRange } from './UserSession';

export interface Receipt {
  id: string;                    // Unique receipt ID (UUID)
  generatedAt: Date;             // Generation timestamp
  timeRange: TimeRange;          // Data time range
  theme: Theme;                  // Applied theme
  items: ReceiptItem[];          // Track items
  totals: ReceiptTotals;        // Calculated totals
  stats: ReceiptStats;          // Fun statistics
  metadata: ReceiptMetadata;    // Additional metadata
}

export interface ReceiptTotals {
  subtotal: number;              // Sum of all items
  tax: number;                   // "Addiction tax" (humor)
  total: number;                 // Final total
}

export interface ReceiptStats {
  totalHours: number;            // Total listening time in hours
  guiltyPleasure: {              // Most played track
    track: string;
    hours: number;
    playCount: number;
  };
  receiptNumber: string;         // Random receipt number (humor)
  cashierName: string;           // From theme
  transactionId: string;         // Fake transaction ID
}

export interface ReceiptMetadata {
  generatedDate: string;         // Formatted date
  generatedTime: string;         // Formatted time
  trackCount: number;            // Number of tracks
  timeRangeLabel: string;        // Human-readable time range
}

/**
 * Creates a new receipt from tracks
 */
export function createReceipt(
  tracks: Track[],
  theme: Theme,
  timeRange: TimeRange
): Receipt {
  const id = generateReceiptId();
  const now = new Date();
  const items = tracks.slice(0, 25).map(track => createReceiptItem(track));
  const totals = calculateTotals(items);
  const stats = generateStats(tracks, theme);
  const metadata = generateMetadata(tracks, timeRange, now);

  return {
    id,
    generatedAt: now,
    timeRange,
    theme,
    items,
    totals,
    stats,
    metadata
  };
}

/**
 * Creates a receipt item from a track
 */
function createReceiptItem(track: Track): ReceiptItem {
  const unitPrice = 0.10; // €0.10 per play
  const quantity = track.playCount;
  const lineTotal = Math.round(quantity * unitPrice * 100) / 100;

  return {
    trackId: track.id,
    displayName: formatTrackName(track),
    quantity,
    unitPrice,
    lineTotal
  };
}

/**
 * Formats track name for receipt display
 */
function formatTrackName(track: Track): string {
  const maxLength = 40;
  const name = `${track.title} - ${track.artist}`;

  if (name.length <= maxLength) return name.toUpperCase();
  return name.substring(0, maxLength - 3).toUpperCase() + '...';
}

/**
 * Calculates receipt totals
 */
function calculateTotals(items: ReceiptItem[]): ReceiptTotals {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const taxRate = 0.15; // 15% "addiction tax"
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return { subtotal, tax, total };
}

/**
 * Generates receipt statistics
 */
function generateStats(tracks: Track[], theme: Theme): ReceiptStats {
  // Calculate total listening time
  const totalMs = tracks.reduce((sum, track) =>
    sum + (track.duration * track.playCount), 0
  );
  const totalHours = Math.round(totalMs / (1000 * 60 * 60) * 10) / 10;

  // Find guilty pleasure (most played track)
  const mostPlayed = tracks.reduce((max, track) =>
    track.playCount > max.playCount ? track : max, tracks[0]
  );

  const guiltyPleasure = mostPlayed ? {
    track: mostPlayed.title,
    hours: Math.round(mostPlayed.duration * mostPlayed.playCount / (1000 * 60 * 60) * 10) / 10,
    playCount: mostPlayed.playCount
  } : {
    track: 'N/A',
    hours: 0,
    playCount: 0
  };

  return {
    totalHours,
    guiltyPleasure,
    receiptNumber: generateReceiptNumber(),
    cashierName: theme.terminology.cashier,
    transactionId: generateTransactionId()
  };
}

/**
 * Generates receipt metadata
 */
function generateMetadata(
  tracks: Track[],
  timeRange: TimeRange,
  date: Date
): ReceiptMetadata {
  const timeRangeLabels = {
    short_term: 'Last 4 Weeks',
    medium_term: 'Last 6 Months',
    long_term: 'All Time'
  };

  return {
    generatedDate: formatDate(date),
    generatedTime: formatTime(date),
    trackCount: tracks.length,
    timeRangeLabel: timeRangeLabels[timeRange]
  };
}

/**
 * Generates a unique receipt ID
 */
function generateReceiptId(): string {
  return `RCP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`.toUpperCase();
}

/**
 * Generates a random 4-digit receipt number
 */
function generateReceiptNumber(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Generates a fake transaction ID
 */
function generateTransactionId(): string {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

/**
 * Formats date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formats time for display
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Validates a receipt object
 */
export function validateReceipt(receipt: any): receipt is Receipt {
  return (
    typeof receipt.id === 'string' &&
    receipt.generatedAt instanceof Date &&
    typeof receipt.timeRange === 'string' &&
    typeof receipt.theme === 'object' &&
    Array.isArray(receipt.items) &&
    typeof receipt.totals === 'object' &&
    typeof receipt.stats === 'object'
  );
}