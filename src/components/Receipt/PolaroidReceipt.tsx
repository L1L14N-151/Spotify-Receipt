import React from 'react';
import { SpotifyReceipt } from '../../models/SpotifyReceipt';
import { formatDuration, formatCurrency } from '../../utils/formatters';
import { OptimizedImage } from './OptimizedImage';
import { RickrollQRCode } from './QRCode';
import styles from './PolaroidReceipt.module.css';

interface PolaroidReceiptProps {
  receipt: SpotifyReceipt;
}

export const PolaroidReceipt: React.FC<PolaroidReceiptProps> = ({ receipt }) => {
  if (!receipt) {
    return <div>Loading...</div>;
  }

  const topTracks = receipt?.topTracks || [];
  const totalAmount = receipt?.totalValue || 0;
  const totalTime = receipt?.totalDuration || 0;
  const currentDate = new Date(receipt?.generatedAt || Date.now());
  const totalPlays = topTracks.reduce((sum, t) => sum + (t.playCount || 0), 0);

  // Get top 5 tracks for the polaroid stack
  const mainTrack = topTracks[0];
  const stackedTracks = topTracks.slice(1, 5);

  // Calculate real streaming value
  const STREAM_RATE = 0.003; // Real Spotify rate
  const totalStreams = topTracks.reduce((sum, track) => sum + (track.playCount || 0), 0);
  const realValue = totalStreams * STREAM_RATE;

  const formatMonth = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]}. '${date.getFullYear().toString().slice(2)}`;
  };

  const getHandwrittenNote = (plays: number) => {
    if (plays > 100) return "couldn't stop listening 😭";
    if (plays > 50) return "on repeat all day";
    if (plays > 25) return "my summer anthem";
    return "good vibes only";
  };

  const getMoodText = (plays: number) => {
    if (plays > 100) return "total obsession";
    if (plays > 50) return "heavy rotation";
    if (plays > 25) return "daily soundtrack";
    return "casual listening";
  };

  return (
    <div className={styles.receiptWrapper}>
      <div className={`${styles.receipt} ${styles.polaroidTheme}`}>

        {/* Stack de polaroids */}
        <div className={styles.polaroidStack}>
          {/* Photos empilées derrière */}
          {stackedTracks.map((track, index) => (
            <div
              key={index}
              className={`${styles.polaroidPhoto} ${styles[`stacked${index + 1}`]}`}
            >
              <div className={styles.photoContent}>
                <OptimizedImage
                  src={track.album?.images?.[0]?.url || ''}
                  alt={track.name || ''}
                  className={styles.albumImage}
                  fallback={<div className={styles.photoGradient}></div>}
                />
              </div>
              <div className={styles.polaroidBottom}></div>
            </div>
          ))}

          {/* Photo principale */}
          {mainTrack && (
            <div className={`${styles.polaroidPhoto} ${styles.mainPhoto}`}>
              <div className={styles.photoContent}>
                <OptimizedImage
                  src={mainTrack.album?.images?.[0]?.url || ''}
                  alt={mainTrack.name || ''}
                  className={styles.albumImage}
                  fallback={<div className={styles.photoGradient}></div>}
                />
                <div className={styles.photoOverlay}>
                  <span className={styles.flashEffect}></span>
                </div>
              </div>
              <div className={styles.polaroidBottom}>
                <p className={styles.photoDate}>{formatMonth(currentDate)}</p>
                <p className={styles.playCount}>
                  {mainTrack.name?.substring(0, 20)}{mainTrack.name?.length > 20 ? '...' : ''}
                </p>
                <p className={styles.artistName}>{mainTrack.artists?.[0]?.name || 'Unknown'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Notes manuscrites autour */}
        <div className={styles.handwrittenNotes}>
          <p className={styles.note3}>{totalPlays} plays</p>
          <p className={styles.note4}>{formatDuration(totalTime)}</p>
        </div>

        {/* Liste des autres tracks (comme un ticket derrière) */}
        <div className={styles.ticketList}>
          <div className={styles.ticketHeader}>
            <div className={styles.ticketTitle}>MUSIC MEMORIES</div>
            <div className={styles.ticketDate}>{currentDate.toLocaleDateString()}</div>
          </div>

          <div className={styles.ticketItems}>
            {topTracks.map((track, index) => (
              <div key={index} className={styles.ticketItem}>
                <span className={styles.itemIndex}>#{index + 1}</span>
                <span className={styles.itemName}>
                  {track.name?.substring(0, 20)}{track.name?.length > 20 ? '...' : ''}
                </span>
                <span className={styles.itemPlays}>
                  {(track.playCount || 0).toLocaleString()}× | €{((track.playCount || 0) * STREAM_RATE).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.ticketSeparator}>• • • • • • • • • • • •</div>

          <div className={styles.ticketSummary}>
            <div className={styles.summaryLine}>
              <span>TOTAL PLAYS</span>
              <span>{totalPlays}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>LISTENING TIME</span>
              <span>{formatDuration(totalTime)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>TOP ARTIST</span>
              <span>{mainTrack?.artists?.[0]?.name || 'Unknown'}</span>
            </div>
          </div>

          <div className={styles.summaryLine}>
            <span>TOTAL STREAMS</span>
            <span>{totalStreams}</span>
          </div>

          <div className={styles.ticketTotal}>
            <span>REAL VALUE</span>
            <span className={styles.totalValue}>€{realValue.toFixed(2)}</span>
          </div>

          <div className={styles.ticketFooter}>
            <RickrollQRCode className={styles.qrCode} size={80} />
            <div className={styles.ticketMessage}>SHAKE IT LIKE A POLAROID PICTURE!</div>
          </div>
        </div>

      </div>
    </div>
  );
};