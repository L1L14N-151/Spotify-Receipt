import React, { useMemo } from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import { RickrollQRCode } from './QRCode';
import styles from './MatrixReceipt.module.css';

interface MatrixReceiptProps {
  receipt: ReceiptModel;
}

const MatrixReceipt: React.FC<MatrixReceiptProps> = ({ receipt }) => {
  const date = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const timestamp = date.toISOString();

  // Sort tracks by play count
  const sortedItems = [...receipt.items].sort((a, b) => {
    const playCountA = a.playCount || 0;
    const playCountB = b.playCount || 0;
    return playCountB - playCountA;
  });

  // Use all tracks
  const trackData = sortedItems;

  // Calculate matrix metrics with real streaming price
  const pricePerStream = 0.003; // Real Spotify rate
  const totalPlays = sortedItems.reduce((sum, track) => sum + (track.playCount || 0), 0);
  const totalCost = totalPlays * pricePerStream;
  const totalTracks = sortedItems.length;
  const avgPlays = totalPlays / totalTracks;
  const matrixTime = totalPlays * 3.5 / 60; // hours
  const realityPercentage = Math.max(0, 100 - (matrixTime / 10));

  // Generate session ID
  const sessionId = useMemo(() => {
    const seed = typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now();
    return `MTX-${seed.toString(36).toUpperCase().substring(2, 8)}`;
  }, [receipt.generatedAt]);

  // ASCII art for decoration
  const asciiMatrix = `
  ╔══════════════════════════╗
  ║  MATRIX MUSIC SYSTEM     ║
  ║  v4.2.0 - NEO EDITION    ║
  ╚══════════════════════════╝`;

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.content}>

          {/* System Boot */}
          <div className={styles.header}>
            <div className={styles.systemBoot}>
              SYSTEM INITIALIZING...<br/>
              LOADING KERNEL MODULES...<br/>
              ESTABLISHING CONNECTION TO MATRIX...<br/>
              CONNECTION ESTABLISHED.
            </div>
            <div className={styles.matrixTitle}>
              THE MATRIX HAS YOU
            </div>
            <div className={styles.prompt}>
              root@matrix:~$ analyze_music_data<span className={styles.cursor}></span>
            </div>
          </div>

          {/* System Info */}
          <div className={styles.systemInfo}>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>[SESSION_ID]</span> <span className={styles.infoValue}>{sessionId}</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>[TIMESTAMP]</span> <span className={styles.infoValue}>{timestamp}</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>[USER_LEVEL]</span> <span className={styles.infoValue}>REDPILLED</span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>[REALITY_STATUS]</span> <span className={styles.infoValue}>{realityPercentage.toFixed(1)}%</span>
            </div>
          </div>

          {/* Commands */}
          <div className={styles.commandSection}>
            <div className={styles.command}>ls -la /music/library/</div>
            <div className={styles.output}>total {totalTracks} tracks found</div>

            <div className={styles.command}>grep -r "most_played" ./</div>
            <div className={styles.output}>scanning frequency patterns...</div>

            <div className={styles.command}>sudo ./analyze_addiction.sh</div>
            <div className={styles.output}>WARNING: High dependency detected</div>
          </div>

          {/* Track Data */}
          <div className={styles.trackData}>
            <div className={styles.dataHeader}>
              === TRACK DATA STREAM ===
            </div>

            {trackData.map((track, idx) => {
              const trackName = (track.name || 'CORRUPTED_DATA').toUpperCase();
              const artistName = track.artists?.[0]?.name?.toUpperCase() || 'UNKNOWN_ENTITY';
              const plays = track.playCount || 0;
              const dataSize = (plays * 3.2).toFixed(1);
              const frequency = (plays / totalPlays * 100).toFixed(2);

              return (
                <div key={idx} className={styles.dataEntry}>
                  <div className={styles.entryIndex}>[NODE_{String(idx).padStart(3, '0')}]</div>
                  <div className={styles.entryName}>{trackName}</div>
                  <div className={styles.entryArtist}>ARTIST: {artistName}</div>

                  <div className={styles.entryStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>STREAMS:</span> <span className={styles.statValue}>{plays.toLocaleString()}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>VALUE:</span> <span className={styles.statValue}>€{(plays * pricePerStream).toFixed(2)}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>SIZE:</span> <span className={styles.statValue}>{dataSize}MB</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>FREQ:</span> <span className={styles.statValue}>{frequency}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matrix Analysis */}
          <div className={styles.matrixAnalysis}>
            <div className={styles.analysisTitle}>[SYSTEM ANALYSIS]</div>

            <div className={styles.analysisLine}>
              <span className={styles.analysisLabel}>Total Tracks Processed:</span>
              <span className={styles.analysisValue}>{totalTracks}</span>
            </div>

            <div className={styles.analysisLine}>
              <span className={styles.analysisLabel}>Total Execution Count:</span>
              <span className={styles.analysisValue}>{totalPlays}</span>
            </div>

            <div className={styles.analysisLine}>
              <span className={styles.analysisLabel}>Average Loops/Track:</span>
              <span className={styles.analysisValue}>{avgPlays.toFixed(1)}</span>
            </div>

            <div className={styles.analysisLine}>
              <span className={styles.analysisLabel}>Time in Matrix:</span>
              <span className={styles.analysisValue}>{matrixTime.toFixed(1)}h</span>
            </div>

            <div className={styles.analysisLine}>
              <span className={styles.analysisLabel}>Memory Usage:</span>
              <span className={styles.analysisValue}>{(totalPlays * 3.2).toFixed(0)}MB</span>
            </div>

            <div className={styles.analysisLine}>
              <span className={styles.analysisLabel}>Addiction Level:</span>
              <span className={styles.analysisValue}>
                {matrixTime > 100 ? 'CRITICAL' : matrixTime > 50 ? 'HIGH' : 'MODERATE'}
              </span>
            </div>

            <div className={styles.analysisLine}>
              <span className={styles.analysisLabel}>Stream Value:</span>
              <span className={styles.analysisValue} style={{color: '#00ff00'}}>€{totalCost.toFixed(2)}</span>
            </div>
          </div>

          {/* The Choice */}
          <div className={styles.choice}>
            <div className={styles.choiceTitle}>MAKE YOUR CHOICE</div>
            <div className={styles.pills}>
              <span className={`${styles.pill} ${styles.redPill}`}>🔴</span>
              <span className={`${styles.pill} ${styles.bluePill}`}>🔵</span>
            </div>
            <div className={styles.choiceText}>
              Red pill: See how deep the Spotify rabbit hole goes<br/>
              Blue pill: Return to mainstream radio
            </div>
          </div>

          {/* System Log */}
          <div className={styles.systemLog}>
            <div className={styles.logEntry}>[{timestamp}] System initialized</div>
            <div className={styles.logEntry}>[{timestamp}] Music data loaded</div>
            <div className={styles.logEntry}>[{timestamp}] Analyzing patterns...</div>
            <div className={`${styles.logEntry} ${styles.warning}`}>[WARNING] Unusual activity detected</div>
            <div className={styles.logEntry}>[{timestamp}] Processing top tracks</div>
            <div className={`${styles.logEntry} ${styles.success}`}>[SUCCESS] Analysis complete</div>
            <div className={`${styles.logEntry} ${styles.error}`}>[ERROR] Reality.exe has stopped responding</div>
            <div className={styles.logEntry}>[{timestamp}] Generating report...</div>
          </div>

          {/* ASCII Art */}
          <div className={styles.asciiArt}>{asciiMatrix}</div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerText}>
              MORPHEUS MUSIC SYSTEMS™<br/>
              "Free your mind"<br/>
              <br/>
              THERE IS NO SHUFFLE<br/>
              ONLY DESTINY<br/>
              <br/>
              Session: {sessionId}<br/>
              Port: 1999 | Protocol: TCP/IP<br/>
              Encryption: 256-bit<br/>
            </div>
            <RickrollQRCode className={styles.qrCode} size={65} inverted={true} />
            <div className={styles.footerText}>
              Remember: All we're offering is the truth, nothing more.<br/>
              Your music taste cannot be told, it must be experienced.
            </div>

            <div className={styles.disconnect}>
              [PRESS ANY KEY TO DISCONNECT]
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MatrixReceipt;