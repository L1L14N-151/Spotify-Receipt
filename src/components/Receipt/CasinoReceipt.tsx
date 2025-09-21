import React, { useMemo } from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import { RickrollQRCode } from './QRCode';
import styles from './CasinoReceipt.module.css';

interface CasinoReceiptProps {
  receipt: ReceiptModel;
}

const CasinoReceipt: React.FC<CasinoReceiptProps> = ({ receipt }) => {
  const date = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Sort tracks by play count
  const sortedItems = [...receipt.items].sort((a, b) => {
    const playCountA = a.playCount || 0;
    const playCountB = b.playCount || 0;
    return playCountB - playCountA;
  });

  // Use all tracks for slot results
  const topTracks = sortedItems;

  // Generate random slot symbols
  const slotSymbols = ['🎵', '🎶', '🎤', '🎸', '🎹', '🥁', '🎺', '🎷', '💎', '⭐'];

  // Calculate "winnings" based on real streaming rate
  const pricePerStream = 0.003; // Real Spotify rate
  const totalPlays = topTracks.reduce((sum, track) => sum + (track.playCount || 0), 0);
  const totalAmount = totalPlays * pricePerStream;

  // Memoize slot results to avoid re-renders
  const slotResults = useMemo(() => {
    // Calculate max plays for relative scoring
    const maxPlays = Math.max(...topTracks.map(t => t.playCount || 0));

    return topTracks.map((track, index) => {
      const playCount = track.playCount || 0;
      const ratio = maxPlays > 0 ? playCount / maxPlays : 0;

      // Use track name as seed for consistent "random" symbols
      const seed = (track.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const getSeededSymbol = (idx: number) => slotSymbols[(seed + idx * 137) % slotSymbols.length];

      // Different combinations based on position and relative play count
      if (index === 0) {
        // #1 track - always mega jackpot
        return { symbols: ['💎', '💎', '💎'], result: 'MEGA JACKPOT!', message: '#1 ADDICTION!' };
      } else if (index === 1) {
        // #2 track - always jackpot
        return { symbols: ['🎵', '🎵', '🎵'], result: 'JACKPOT!', message: '#2 OBSESSION!' };
      } else if (index === 2) {
        // #3 track
        return { symbols: ['⭐', '⭐', '⭐'], result: 'BIG WIN!', message: '#3 ON REPEAT!' };
      } else if (ratio > 0.8) {
        // Top 20% of max plays
        return { symbols: ['🎸', '🎸', '🎸'], result: 'HUGE WIN!', message: `${playCount} plays!` };
      } else if (ratio > 0.6) {
        // 60-80% of max plays
        return { symbols: ['🎹', '🎹', '🎹'], result: 'BIG WIN!', message: 'Heavy rotation!' };
      } else if (ratio > 0.4) {
        // 40-60% of max plays
        return { symbols: ['🎺', '🎺', getSeededSymbol(1)], result: 'WIN!', message: 'Regular player' };
      } else if (ratio > 0.25) {
        // 25-40% of max plays
        return { symbols: ['🎵', '🎶', getSeededSymbol(0)], result: 'SMALL WIN', message: 'In the mix' };
      } else if (ratio > 0.1) {
        // 10-25% of max plays
        return { symbols: [getSeededSymbol(0), getSeededSymbol(0), getSeededSymbol(1)], result: 'ALMOST', message: 'Sometimes...' };
      } else {
        // Bottom 10%
        return { symbols: [getSeededSymbol(0), getSeededSymbol(1), getSeededSymbol(2)], result: 'LOSS', message: 'Barely played' };
      }
    });
  }, [topTracks]);

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.content}>

          {/* Casino Header */}
          <div className={styles.header}>
            <div className={styles.stars}>★ ★ ★ ★ ★</div>
            <div className={styles.casinoName}>GOLDEN NUGGET CASINO</div>
            <div className={styles.tagline}>Where Music Dreams Go To Die</div>
            <div className={styles.stars}>★ ★ ★ ★ ★</div>
          </div>

          <div className={styles.divider}>{'═'.repeat(50)}</div>

          {/* Machine Info */}
          <div className={styles.machineInfo}>
            <div className={styles.machineTitle}>🎰 SLOT MACHINE #777 🎰</div>
            <div className={styles.machineSubtitle}>The Spotify Addiction Special</div>
            <div className={styles.timestamp}>{dateStr} | {timeStr}</div>
          </div>

          <div className={styles.divider}>{'─'.repeat(50)}</div>

          {/* Game Results */}
          <div className={styles.gameSection}>
            <div className={styles.sectionTitle}>🎲 SPIN RESULTS 🎲</div>

            {topTracks.map((track, idx) => {
              const slotResult = slotResults[idx];
              const trackName = (track.name || 'UNKNOWN').toUpperCase().substring(0, 20);
              const artistName = track.artists?.[0]?.name?.toUpperCase().substring(0, 15) || 'UNKNOWN';

              return (
                <div key={idx} className={styles.spin}>
                  <div className={styles.spinNumber}>SPIN #{idx + 1}</div>

                  <div className={styles.slotMachine}>
                    <div className={styles.slots}>
                      {slotResult.symbols.map((symbol, i) => (
                        <span key={i} className={styles.slot}>[{symbol}]</span>
                      ))}
                    </div>
                    <div className={`${styles.slotResult} ${slotResult.result === 'JACKPOT!' ? styles.jackpot : slotResult.result === 'WIN!' ? styles.win : styles.loss}`}>
                      ← {slotResult.result}
                    </div>
                  </div>

                  <div className={styles.trackInfo}>
                    <div className={styles.trackName}>{trackName}</div>
                    <div className={styles.artistName}>by {artistName}</div>
                    <div className={styles.playInfo}>
                      Streams: {(track.playCount || 0).toLocaleString()} | Value: €{((track.playCount || 0) * 0.003).toFixed(2)}
                    </div>
                    <div className={styles.playInfo}>
                      {slotResult.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.divider}>{'═'.repeat(50)}</div>

          {/* Payout Section */}
          <div className={styles.payoutSection}>
            <div className={styles.sectionTitle}>💰 PAYOUT SUMMARY 💰</div>

            <div className={styles.payoutLine}>
              <span>Total Spins:</span>
              <span>{topTracks.length}</span>
            </div>

            <div className={styles.payoutLine}>
              <span>Total Plays Bet:</span>
              <span>{totalPlays}</span>
            </div>

            <div className={styles.divider}>{'─'.repeat(50)}</div>

            <div className={styles.payoutTotal}>
              <span>TOTAL VALUE:</span>
              <span className={styles.totalAmount}>€{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.divider}>{'═'.repeat(50)}</div>

          {/* House Messages */}
          <div className={styles.houseMessage}>
            <div className={styles.quote}>"The house always wins"</div>
            <div className={styles.subquote}>- Spotify Algorithm, 2024</div>
          </div>

          <div className={styles.warnings}>
            <div className={styles.warningTitle}>⚠️ RESPONSIBLE GAMING ⚠️</div>
            <div className={styles.warningText}>
              If you or someone you know has been listening to<br/>
              the same song 143 times, please seek help.<br/>
              <br/>
              Symptoms of music addiction include:<br/>
              • Knowing every ad-lib<br/>
              • Air drumming in public<br/>
              • Shower concerts<br/>
              • "Just one more song" at 3 AM<br/>
            </div>
          </div>

          <div className={styles.divider}>{'═'.repeat(50)}</div>

          {/* Lucky Numbers */}
          <div className={styles.luckyNumbers}>
            <div className={styles.luckyTitle}>🍀 TODAY'S LUCKY NUMBERS 🍀</div>
            <div className={styles.numbers}>
              {[7, 7, 7, 21, 69, 420].map((num, i) => (
                <span key={i} className={styles.luckyNumber}>{num}</span>
              ))}
            </div>
            <div className={styles.luckyNote}>(These won't help you)</div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.divider}>{'═'.repeat(50)}</div>
            <div className={styles.footerText}>
              GOLDEN NUGGET CASINO<br/>
              Las Vegas, NV 89109<br/>
              <br/>
              "What happens in your Spotify stays in Wrapped"<br/>
              <br/>
              Come back tomorrow!<br/>
              (We know you will)<br/>
              <br/>
              Player ID: {((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) * 999).toString(36).substring(0, 7).toUpperCase()}<br/>
              Machine: SPOT-777-{Math.floor(((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) * 17) % 999)}<br/>
            </div>
            <RickrollQRCode className={styles.qrCode} size={70} inverted={true} />
            <div className={styles.disclaimer}>
              Not redeemable for actual money<br/>
              Your time has no cash value<br/>
              House edge: 100%
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CasinoReceipt;