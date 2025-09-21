/**
 * Receipt Service
 * Handles receipt generation and formatting
 */

import { IReceiptService, Receipt, PricingResult, ReceiptStats, FormattedReceipt } from './types';
import { SpotifyTrack, TimeRange } from '../spotify/types';
import { Theme } from '../theme/types';
import { createReceipt } from '../../models/Receipt';
import { createReceiptItem } from '../../models/ReceiptItem';
import { truncateTitle } from '../../models/Track';
import { SpotifyReceipt } from '../../models/SpotifyReceipt';

export class ReceiptService implements IReceiptService {
  generateReceipt(tracks: SpotifyTrack[], theme: Theme, timeRange: TimeRange): SpotifyReceipt {
    if (!tracks || tracks.length === 0) {
      throw new Error('No tracks available');
    }

    // Sort tracks by play count (most played first)
    const sortedTracks = [...tracks].sort((a, b) => b.playCount - a.playCount);

    // Convert SpotifyTrack to Track format for receipt items
    const formattedTracks = sortedTracks.map((track, index) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      artists: track.artists,
      album: track.album,
      playCount: track.playCount,
      duration: track.durationMs,
      albumArt: track.albumArtUrl,
      rank: index + 1
    }));

    // Create receipt using model function
    const receipt = createReceipt(formattedTracks, theme, timeRange);

    // Create SpotifyReceipt with extended properties
    const spotifyReceipt: SpotifyReceipt = {
      ...receipt,
      items: sortedTracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        artists: track.artists,
        album: track.album,
        duration_ms: track.durationMs,
        duration: track.durationMs,
        playCount: track.playCount,
        price: track.playCount * 0.10,
        quantity: track.playCount,
        trackId: track.id,
        displayName: `${track.name} - ${track.artists.map(a => a.name).join(', ')}`,
        unitPrice: 0.10,
        lineTotal: track.playCount * 0.10
      })),
      topTracks: sortedTracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        artists: track.artists,
        album: track.album,
        duration: track.durationMs,
        duration_ms: track.durationMs,
        playCount: track.playCount,
        price: track.playCount * 0.003
      })),
      totalValue: sortedTracks.reduce((sum, track) => sum + (track.playCount * 0.003), 0),
      totalDuration: sortedTracks.reduce((sum, track) => sum + (track.durationMs * track.playCount), 0),

      // Add missing properties for components
      storeName: theme.terminology.storeName,
      timestamp: receipt.generatedAt,
      total: receipt.totals.total,
      tax: receipt.totals.tax,
      subtotal: receipt.totals.subtotal,
      paymentMethod: theme.terminology.paymentMethod,
      transactionId: receipt.stats.transactionId,
      theme: theme,

      // Extend metadata
      metadata: {
        ...receipt.metadata,
        generatedAt: receipt.generatedAt,
        timeRange: timeRange,
        receiptNumber: receipt.stats.receiptNumber,
        taxRate: 0.15
      },

      // Extend stats
      stats: {
        ...receipt.stats,
        totalListeningTime: receipt.stats.totalHours * 60 * 60 * 1000,
        totalPlays: sortedTracks.reduce((sum, track) => sum + track.playCount, 0),
        averagePlaysPerTrack: Math.round(sortedTracks.reduce((sum, track) => sum + track.playCount, 0) / sortedTracks.length)
      },

      // Extend totals
      totals: {
        ...receipt.totals,
        taxRate: 0.15
      }
    };

    return spotifyReceipt;
  }

  calculatePricing(tracks: SpotifyTrack[]): PricingResult {
    const pricePerPlay = 0.10; // €0.10 per play
    const taxRate = 0.15; // 15% addiction tax

    const items = tracks.map(track => ({
      trackId: track.id,
      price: Math.round(track.playCount * pricePerPlay * 100) / 100
    }));

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    return {
      items,
      subtotal,
      tax,
      total
    };
  }

  generateStats(tracks: SpotifyTrack[]): ReceiptStats {
    // Calculate total listening time
    const totalMs = tracks.reduce((sum, track) =>
      sum + (track.durationMs * track.playCount), 0
    );
    const totalHours = Math.round(totalMs / (1000 * 60 * 60) * 10) / 10;

    // Find most played track (guilty pleasure)
    const mostPlayed = tracks.reduce((max, track) =>
      track.playCount > max.playCount ? track : max, tracks[0]
    );

    const guiltyPleasure = mostPlayed ? {
      track: mostPlayed.name,
      hours: Math.round(mostPlayed.durationMs * mostPlayed.playCount / (1000 * 60 * 60) * 10) / 10
    } : {
      track: 'N/A',
      hours: 0
    };

    return {
      totalHours,
      guiltyPleasure,
      receiptNumber: this.generateReceiptNumber(),
      cashierName: 'DJ-BOT'
    };
  }

  formatReceipt(receipt: Receipt): FormattedReceipt {
    const header = this.formatHeader(receipt);
    const items = this.formatItems(receipt);
    const totals = this.formatTotals(receipt);
    const footer = this.formatFooter(receipt);

    return { header, items, totals, footer };
  }

  private formatHeader(receipt: Receipt): string[] {
    const theme = receipt.theme;
    const lines: string[] = [
      theme.terminology.storeName,
      theme.terminology.storeAddress,
      theme.terminology.storePhone,
      '------------------------',
      `CASHIER: ${theme.terminology.cashier}     #${receipt.stats.receiptNumber}`,
      `DATE: ${receipt.metadata.generatedDate}  ${receipt.metadata.generatedTime}`,
      '------------------------'
    ];
    return lines;
  }

  private formatItems(receipt: Receipt): string[] {
    const lines: string[] = [];

    receipt.items.forEach((item, index) => {
      // Track name line
      lines.push(item.displayName.toUpperCase());

      // Price line with dots
      const quantityStr = `${item.quantity} plays`;
      const priceStr = `€${item.lineTotal.toFixed(2)}`;
      const totalWidth = 50;
      const usedWidth = quantityStr.length + priceStr.length;
      const dotsNeeded = Math.max(1, totalWidth - usedWidth);
      const dots = '.'.repeat(dotsNeeded);

      lines.push(`${quantityStr}${dots}${priceStr}`);

      // Add spacing between items (except last)
      if (index < receipt.items.length - 1) {
        lines.push('');
      }
    });

    return lines;
  }

  private formatTotals(receipt: Receipt): string[] {
    const theme = receipt.theme;
    const lines: string[] = [
      '------------------------',
      this.formatLine(theme.terminology.subtotalLabel, `€${receipt.totals.subtotal.toFixed(2)}`),
      this.formatLine(theme.terminology.taxLabel, `€${receipt.totals.tax.toFixed(2)}`),
      this.formatLine(theme.terminology.totalLabel, `€${receipt.totals.total.toFixed(2)}`),
      '------------------------'
    ];
    return lines;
  }

  private formatFooter(receipt: Receipt): string[] {
    const theme = receipt.theme;
    const wastedTime = theme.terminology.wastedTimeMessage
      .replace('{hours}', receipt.stats.totalHours.toString());

    const lines: string[] = [
      theme.terminology.paymentMethod,
      '',
      ...theme.terminology.thankYouMessage.split('\n'),
      wastedTime,
      '------------------------'
    ];
    return lines;
  }

  private formatLine(label: string, value: string, width: number = 50): string {
    const spacing = width - label.length - value.length;
    const spaces = ' '.repeat(Math.max(1, spacing));
    return `${label}:${spaces}${value}`;
  }

  private generateReceiptNumber(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

// Export singleton instance
const receiptService = new ReceiptService();
export default receiptService;