import React, { useMemo } from 'react';
import { SpotifyReceipt } from '../../models/SpotifyReceipt';
import { formatDuration, formatCurrency } from '../../utils/formatters';
import { RickrollQRCode } from './QRCode';
import styles from './GamingReceipt.module.css';

interface GamingReceiptProps {
  receipt: SpotifyReceipt;
}

export const GamingReceipt: React.FC<GamingReceiptProps> = ({ receipt }) => {
  const topTracks = receipt.topTracks || [];
  // Calculate real value based on streaming
  const STREAM_RATE = 0.003; // Real Spotify rate
  const totalStreams = topTracks.reduce((sum, track) => sum + (track.playCount || 0), 0);
  const realAmount = totalStreams * STREAM_RATE;
  const totalAmount = realAmount; // Use real amount
  const totalTime = receipt.totalDuration || 0;
  const currentDate = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const orderNumber = ((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 999999).toString(16).toUpperCase();
  
  // Calculate achievements and stats
  const achievements = useMemo(() => {
    const totalPlays = topTracks.reduce((sum, t) => sum + (t.playCount || 0), 0);
    const avgPlays = totalPlays / Math.max(topTracks.length, 1);
    const maxPlays = Math.max(...topTracks.map(t => t.playCount || 0));
    
    const earned = [];

    // Achievements basés sur des seuils stricts
    if (totalPlays > 2000) earned.push({
      name: 'No Life Mode',
      icon: '💀',
      rarity: 'Legendary',
      description: 'Played tracks over 2000 times total'
    });
    else if (totalPlays > 1000) earned.push({
      name: 'Audiophile Elite',
      icon: '🎧',
      rarity: 'Epic',
      description: 'Played tracks over 1000 times total'
    });
    else if (totalPlays > 500) earned.push({
      name: 'Music Enthusiast',
      icon: '🎵',
      rarity: 'Rare',
      description: 'Played tracks over 500 times total'
    });

    if (maxPlays > 300) earned.push({
      name: 'Obsession Level 999',
      icon: '🔁',
      rarity: 'Legendary',
      description: 'Played a single track over 300 times'
    });
    else if (maxPlays > 200) earned.push({
      name: 'One Track Mind',
      icon: '🎯',
      rarity: 'Epic',
      description: 'Played a single track over 200 times'
    });
    else if (maxPlays > 100) earned.push({
      name: 'Repeat Offender',
      icon: '🔄',
      rarity: 'Rare',
      description: 'Played a single track over 100 times'
    });

    if (avgPlays > 100) earned.push({
      name: 'Dedication Master',
      icon: '🏆',
      rarity: 'Epic',
      description: 'Average of 100+ plays per track'
    });
    else if (avgPlays > 50) earned.push({
      name: 'Loyal Listener',
      icon: '⭐',
      rarity: 'Rare',
      description: 'Average of 50+ plays per track'
    });

    if (topTracks.length >= 25) earned.push({
      name: 'Collector\'s Edition',
      icon: '📀',
      rarity: 'Rare',
      description: 'Collected 25 favorite tracks'
    });
    if (totalTime > 10800000) earned.push({
      name: 'Time Sink Champion',
      icon: '⏰',
      rarity: 'Legendary',
      description: 'Over 3 hours of total listening time'
    }); // 3h+
    
    return earned;
  }, [topTracks]);
  
  // Generate game-like items from tracks
  const gameItems = useMemo(() => {
    const totalTracks = topTracks.length;

    // Calculer les limites de rareté basées sur le nombre de tracks
    // Legendary: top 10% (min 1, max 4)
    const legendaryLimit = Math.min(4, Math.max(1, Math.floor(totalTracks * 0.1)));
    // Epic: next 15% (min 1, max 6)
    const epicLimit = Math.min(6, Math.max(1, Math.floor(totalTracks * 0.15)));
    // Rare: next 25%
    const rareLimit = Math.floor(totalTracks * 0.25);
    // Uncommon: next 25%
    const uncommonLimit = Math.floor(totalTracks * 0.25);
    // Rest is Common

    return topTracks.map((track, index) => {
      const seed = (typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) + index;
      const playCount = track.playCount || 0;

      // Determine rarity based on position AND play count
      let rarity = 'Common';
      let rarityColor = styles.common;

      if (index < legendaryLimit && playCount > 200) {
        // Top tracks with high play count
        rarity = 'Legendary';
        rarityColor = styles.legendary;
      } else if (index < (legendaryLimit + epicLimit) && playCount > 150) {
        // Next tier with good play count
        rarity = 'Epic';
        rarityColor = styles.epic;
      } else if (index < (legendaryLimit + epicLimit + rareLimit) && playCount > 80) {
        rarity = 'Rare';
        rarityColor = styles.rare;
      } else if (index < (legendaryLimit + epicLimit + rareLimit + uncommonLimit) && playCount > 40) {
        rarity = 'Uncommon';
        rarityColor = styles.uncommon;
      }
      
      // DLC/Season Pass status
      const dlcTypes = ['Base Game', 'Season Pass', 'DLC', 'Expansion Pack', 'Deluxe Edition'];
      const dlcType = dlcTypes[seed % dlcTypes.length];
      
      // XP Calculation:
      // Base XP = playCount × 50
      // Bonus XP for rarity: Legendary +1000, Epic +500, Rare +250, Uncommon +100
      let bonusXP = 0;
      if (rarity === 'Legendary') bonusXP = 1000;
      else if (rarity === 'Epic') bonusXP = 500;
      else if (rarity === 'Rare') bonusXP = 250;
      else if (rarity === 'Uncommon') bonusXP = 100;

      return {
        name: track.name || 'Unknown Track',
        artist: track.artists?.[0]?.name || 'Unknown Developer',
        rarity,
        rarityColor,
        level: Math.min(99, Math.floor(playCount / 3)), // Level based on plays/3
        xp: (playCount * 50) + bonusXP, // Base XP + rarity bonus
        price: track.value || 0,
        duration: track.duration || 0,
        dlcType,
        playCount
      };
    });
  }, [topTracks, receipt.generatedAt]);
  
  const totalXP = gameItems.reduce((sum, item) => sum + item.xp, 0);
  const playerLevel = Math.min(100, Math.floor(totalXP / 10000));

  // Get max play count for progress bar calculation
  const maxPlayCount = Math.max(...topTracks.map(t => t.playCount || 0));

  const generateProgressBar = (percent: number) => {
    const filled = Math.floor(Math.min(100, percent) / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty) + `${Math.round(percent)}`;
  };
  
  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.scanlines}></div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.steamLogo}>
              <i className="fab fa-steam"></i>
            </div>
            <div className={styles.steamTitle}>STEAM</div>
            <div className={styles.storeName}>Music Store</div>
            <div className={styles.purchaseInfo}>
              <div className={styles.receiptId}>Receipt #{orderNumber}</div>
              <div className={styles.purchaseDate}>{currentDate.toLocaleDateString()} @ {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            </div>
          </div>
          
          <div className={styles.accountInfo}>
            <div className={styles.accountLine}>
              <span>Account:</span>
              <span className={styles.username}>SpotifyPlayer</span>
            </div>
            <div className={styles.accountLine}>
              <span>Level:</span>
              <span className={styles.level}>{playerLevel}</span>
            </div>
            <div className={styles.accountLine}>
              <span>Total XP:</span>
              <span className={styles.xp}>{totalXP.toLocaleString()}</span>
            </div>
          </div>
          
          <div className={styles.separator}>════════════════════════════════</div>
          
          <div className={styles.sectionTitle}>
            <span className={styles.cartIcon}>🛒</span> SHOPPING CART
          </div>
          
          <div className={styles.items}>
            {gameItems.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemName}>{item.name} - Ultimate Edition</span>
                </div>
                <div className={styles.itemDeveloper}>by {item.artist}</div>
                <div className={styles.itemTree}>
                  <div>├─ Total Streams: {item.playCount.toLocaleString()}</div>
                  <div>├─ Stream Value: €{(item.playCount * STREAM_RATE).toFixed(2)}</div>
                  <div>├─ Achievement Progress: {generateProgressBar(60 + ((item.playCount / maxPlayCount) * 40))}%</div>
                  <div>└─ Status: <span className={index === 0 ? styles.playing : styles.inLibrary}>{index === 0 ? 'CURRENTLY PLAYING' : 'IN LIBRARY'}</span></div>
                </div>
                <div className={styles.itemFooter}>
                  <span className={`${styles.rarity} ${item.rarityColor}`}>[{item.rarity}]</span>
                  <span className={styles.itemPrice}>{formatCurrency(item.price)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.separator}>════════════════════════════════</div>
          
          <div className={styles.achievements}>
            <div className={styles.achievementsTitle}>
              🏆 ACHIEVEMENTS UNLOCKED
            </div>
            {achievements.length > 0 ? (
              <div className={styles.achievementList}>
                {achievements.map((achievement, index) => (
                  <div key={index} className={styles.achievement}>
                    <div className={styles.achievementIcon}>{achievement.icon}</div>
                    <div className={styles.achievementContent}>
                      <div className={styles.achievementUnlocked}>🏆 Achievement Unlocked!</div>
                      <div className={styles.achievementName}>"{achievement.name}"</div>
                      <div className={styles.achievementDesc}>{achievement.description}</div>
                      <div className={`${styles.achievementRarity} ${styles[`rarity${achievement.rarity}`]}`}>[{achievement.rarity}]</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noAchievements}>Keep playing to unlock achievements!</div>
            )}
          </div>
          
          <div className={styles.separator}>════════════════════════════════</div>
          
          <div className={styles.stats}>
            <div className={styles.statsTitle}>SESSION STATS</div>
            <div className={styles.statGrid}>
              <div className={styles.statItem}>
                <div className={styles.statItemLabel}>Time Played</div>
                <div className={styles.statItemValue}>{formatDuration(totalTime)}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statItemLabel}>Tracks Collected</div>
                <div className={styles.statItemValue}>{topTracks.length}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statItemLabel}>Total Plays</div>
                <div className={styles.statItemValue}>
                  {topTracks.reduce((sum, t) => sum + (t.playCount || 0), 0)}
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statItemLabel}>Avg Play/Track</div>
                <div className={styles.statItemValue}>
                  {Math.round(topTracks.reduce((sum, t) => sum + (t.playCount || 0), 0) / Math.max(topTracks.length, 1))}
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.separator}>════════════════════════════════</div>
          
          <div className={styles.checkout}>
            <div className={styles.checkoutLine}>
              <span>Total Streams:</span>
              <span>{totalStreams.toLocaleString()}</span>
            </div>
            <div className={styles.checkoutLine}>
              <span>Stream Rate:</span>
              <span>€{STREAM_RATE}/play</span>
            </div>
            <div className={styles.total}>
              <span>TOTAL VALUE:</span>
              <span>€{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.separator}>════════════════════════════════</div>
          
          <div className={styles.paymentMethod}>
            <div className={styles.paymentTitle}>PAYMENT METHOD</div>
            <div className={styles.paymentOption}>✓ Spotify Premium Credits</div>
          </div>
          
          <div className={styles.separator}>════════════════════════════════</div>
          
          <div className={styles.downloadInfo}>
            <div className={styles.downloadTitle}>📦 DOWNLOAD QUEUE</div>
            <div className={styles.downloadText}>All tracks added to your library</div>
            <div className={styles.downloadSpeed}>Download speed: INSTANT</div>
            <div className={styles.downloadBar}>
              <div className={styles.downloadProgress}></div>
            </div>
            <div className={styles.downloadComplete}>DOWNLOAD COMPLETE!</div>
          </div>
          
          <div className={styles.separator}>════════════════════════════════</div>
          
          <div className={styles.footer}>
            <div className={styles.orderId}>Order ID: #{orderNumber}</div>
            <div className={styles.date}>{currentDate.toLocaleString()}</div>
            <RickrollQRCode className={styles.qrCode} size={65} inverted={true} />
            <div className={styles.message}>Thanks for your purchase!</div>
            <div className={styles.glhf}>GL HF!</div>
            <div className={styles.copyright}>© Valve Corporation</div>
          </div>
        </div>
      </div>
    </div>
  );
};