import React from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import { RickrollQRCode } from './QRCode';
import styles from './ClassicReceipt.module.css';

interface ClassicReceiptProps {
  receipt: ReceiptModel;
}

const ClassicReceipt: React.FC<ClassicReceiptProps> = ({ receipt }) => {
  const date = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Sort tracks by play count (most played first)
  const sortedItems = [...receipt.items].sort((a, b) => {
    const playCountA = a.playCount || 0;
    const playCountB = b.playCount || 0;
    return playCountB - playCountA;
  });

  // Calculate totals with real Spotify rate
  const pricePerStream = 0.003; // €0.003 per stream
  let subtotal = 0;

  const itemsWithPrice = sortedItems.map(track => {
    const playCount = track.playCount || 1;
    const price = playCount * pricePerStream;
    subtotal += price;
    return { ...track, playCount, price };
  });

  const total = subtotal;

  // Format price in euros
  const formatPrice = (price: number) => {
    return '€' + price.toFixed(2);
  };

  // Truncate text to fit receipt width
  const truncate = (text: string, maxLen: number) => {
    if (!text) return 'UNKNOWN';
    if (text.length <= maxLen) return text.toUpperCase();
    return text.substring(0, maxLen - 1).toUpperCase() + '.';
  };

  // Format line with dots
  const formatLine = (left: string, right: string, width: number = 36) => {
    const maxLeftLen = width - right.length - 3;
    const leftStr = truncate(left, maxLeftLen);
    const dotsCount = Math.max(1, width - leftStr.length - right.length);
    const dots = '.'.repeat(dotsCount);
    return `${leftStr}${dots}${right}`;
  };

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <pre className={styles.content}>{`
        🎵 SPOTIFY RECEIPT
        ==================

        SPOTIFY STREAMING CO.
        Transaction #1337
        ${dateStr} ${timeStr}

========================================

${itemsWithPrice.slice(0, 25).map((item, idx) => {
  const trackName = truncate(item.name || 'Unknown', 20);
  const artistName = truncate(item.artists?.[0]?.name || 'Unknown', 15);
  const price = formatPrice(item.price);

  return `${trackName}\n` +
         `  by ${artistName}\n` +
         `  ${item.playCount} plays${'.'.repeat(Math.max(1, 28 - item.playCount.toString().length - 6))}${price}\n` +
         `\n`;
}).join('')}

========================================
TOTAL STREAMS       ${itemsWithPrice.reduce((sum, item) => sum + item.playCount, 0).toLocaleString().padStart(8)}
========================================
TOTAL               ${formatPrice(total).padStart(8)}
========================================

PAYMENT METHOD: SPOTIFY PREMIUM
ACCOUNT: ****4242
STATUS: APPROVED

Total Items: ${itemsWithPrice.length}
Total Streams: ${itemsWithPrice.reduce((sum, item) => sum + item.playCount, 0)}
Rate: €0.003/stream

        THANK YOU!
    Keep Streaming 🎧

`}</pre>
        <RickrollQRCode size={60} />
        <pre className={styles.receiptText}>{`
----------------------------------------
${receipt.metadata?.timeRangeLabel || 'LAST 6 MONTHS'}
----------------------------------------
`}</pre>
      </div>
    </div>
  );
};

export default ClassicReceipt;