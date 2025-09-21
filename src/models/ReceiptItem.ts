/**
 * ReceiptItem Model
 * Represents a line item on the receipt
 */

export interface ReceiptItem {
  trackId: string;           // Reference to Track.id
  displayName: string;       // Formatted display text
  quantity: number;          // Play count
  unitPrice: number;         // Price per play (€0.10)
  lineTotal: number;         // quantity * unitPrice
}

/**
 * Creates a receipt item
 */
export function createReceiptItem(
  trackId: string,
  displayName: string,
  playCount: number,
  pricePerPlay: number = 0.10
): ReceiptItem {
  const quantity = playCount;
  const unitPrice = pricePerPlay;
  const lineTotal = Math.round(quantity * unitPrice * 100) / 100;

  return {
    trackId,
    displayName,
    quantity,
    unitPrice,
    lineTotal
  };
}

/**
 * Formats a receipt item for display
 */
export function formatReceiptItem(item: ReceiptItem): string {
  const nameWidth = 35;
  const priceWidth = 10;

  // Truncate name if too long
  let displayName = item.displayName;
  if (displayName.length > nameWidth) {
    displayName = displayName.substring(0, nameWidth - 3) + '...';
  }

  // Format quantity and price
  const quantityStr = `${item.quantity} plays`;
  const priceStr = `€${item.lineTotal.toFixed(2)}`;

  // Calculate dots to fill space
  const totalWidth = 50;
  const usedWidth = displayName.length + priceStr.length;
  const dotsNeeded = Math.max(1, totalWidth - usedWidth);
  const dots = '.'.repeat(dotsNeeded);

  return `${displayName}${dots}${priceStr}`;
}

/**
 * Formats item with quantity on separate line (alternative format)
 */
export function formatReceiptItemMultiline(item: ReceiptItem): string[] {
  const priceStr = `€${item.lineTotal.toFixed(2)}`;
  const quantityStr = `${item.quantity} plays`;

  // First line: track name
  const nameLine = item.displayName.toUpperCase();

  // Second line: quantity and price
  const totalWidth = 50;
  const usedWidth = quantityStr.length + priceStr.length;
  const dotsNeeded = Math.max(1, totalWidth - usedWidth);
  const dots = '.'.repeat(dotsNeeded);
  const priceLine = `${quantityStr}${dots}${priceStr}`;

  return [nameLine, priceLine];
}

/**
 * Validates a receipt item
 */
export function validateReceiptItem(item: any): item is ReceiptItem {
  return (
    typeof item.trackId === 'string' &&
    typeof item.displayName === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.unitPrice === 'number' &&
    typeof item.lineTotal === 'number' &&
    item.quantity >= 0 &&
    item.unitPrice >= 0 &&
    Math.abs(item.lineTotal - (item.quantity * item.unitPrice)) < 0.01 // Allow for rounding
  );
}

/**
 * Calculates subtotal for a list of items
 */
export function calculateSubtotal(items: ReceiptItem[]): number {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return Math.round(subtotal * 100) / 100;
}

/**
 * Groups items by artist (for alternative receipt formats)
 */
export function groupItemsByArtist(items: ReceiptItem[]): Map<string, ReceiptItem[]> {
  const groups = new Map<string, ReceiptItem[]>();

  items.forEach(item => {
    // Extract artist from display name (assuming format: "TRACK - ARTIST")
    const parts = item.displayName.split(' - ');
    const artist = parts.length > 1 ? parts[1] : 'Unknown Artist';

    if (!groups.has(artist)) {
      groups.set(artist, []);
    }
    groups.get(artist)!.push(item);
  });

  return groups;
}