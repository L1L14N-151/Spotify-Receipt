import React from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import styles from './TextReceipt.module.css';

interface TextReceiptProps {
  receipt: ReceiptModel;
}

const TextReceipt: React.FC<TextReceiptProps> = ({ receipt }) => {
  const theme = receipt.theme;
  const dateStr = new Date(receipt.metadata.generatedAt || Date.now()).toLocaleDateString('fr-FR');
  const timeStr = new Date(receipt.metadata.generatedAt || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // Format price with euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + '€';
  };

  // Format duration in mm:ss
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Pad string to fixed width
  const padRight = (str: string, len: number) => {
    return str.substring(0, len).padEnd(len, ' ');
  };

  const padLeft = (str: string, len: number) => {
    return str.substring(0, len).padStart(len, ' ');
  };

  const centerText = (text: string, width: number) => {
    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(Math.max(0, padding)) + text;
  };

  return (
    <div className={styles.receipt}>
      <pre className={styles.receiptText}>
{centerText('================================', 40)}
{centerText(theme.terminology.storeName.toUpperCase(), 40)}
{centerText('================================', 40)}
{`Date: ${dateStr}    Heure: ${timeStr}`}
{`Caisse: #${Math.floor(Math.random() * 9) + 1}    Trans: ${receipt.metadata.receiptNumber}`}
{centerText('--------------------------------', 40)}

ARTICLES:

{receipt.items.map((track, idx) => {
  const playCount = track.playCount || Math.floor(Math.random() * 50) + 1;
  const price = playCount * 0.10;
  const titleLine = padRight(`${track.name || 'Unknown Track'}`, 28);
  const priceLine = padLeft(formatPrice(price), 10);
  const artistsStr = track.artists ? track.artists.map(a => a.name).join(', ') : 'Unknown Artist';
  const artistLine = `  ${padRight(artistsStr, 25)}`;
  const qtyLine = `  ${playCount}x @ ${formatPrice(0.10)} = ${padLeft(formatPrice(price), 10)}`;
  const durationLine = `  Durée: ${formatDuration(track.duration_ms || 0)} min`;

  return `${titleLine}${priceLine}
${artistLine}
${qtyLine}
${durationLine}
`;
}).join('\n')}
{centerText('--------------------------------', 40)}

{padRight('SOUS-TOTAL', 28)}{padLeft(formatPrice(receipt.totals.subtotal), 10)}
{padRight(`TVA (${((receipt.totals.taxRate || 0.0825) * 100).toFixed(0)}%)`, 28)}{padLeft(formatPrice(receipt.totals.tax), 10)}
{centerText('================================', 40)}
{padRight('TOTAL', 28)}{padLeft(formatPrice(receipt.totals.total), 10)}
{centerText('================================', 40)}

{centerText('STATISTIQUES', 40)}
{centerText('----------------', 40)}
Morceaux les plus écoutés
Temps total: {Math.floor((receipt.stats?.totalListeningTime || 0) / 60000)} min
Écoutes totales: {receipt.stats?.totalPlays || 0}
Moy/morceau: {(receipt.stats?.averagePlaysPerTrack || 0).toFixed(1)}x

{centerText('--------------------------------', 40)}
{centerText(theme.terminology.thankYouMessage, 40)}
{centerText('SPOTIFY RECEIPT GENERATOR', 40)}
{centerText('================================', 40)}

Période: {receipt.metadata.timeRange}
{receipt.metadata.userId}

{centerText('**** CECI EST UN FAUX TICKET ****', 40)}
{centerText('**** GÉNÉRÉ POUR LE FUN ****', 40)}
      </pre>
    </div>
  );
};

export default TextReceipt;