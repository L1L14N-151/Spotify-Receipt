import React, { useMemo } from 'react';
import { SpotifyReceipt } from '../../models/SpotifyReceipt';
import { formatDuration, formatCurrency } from '../../utils/formatters';
import { RickrollQRCode } from './QRCode';
import styles from './GitHubReceipt.module.css';

interface GitHubReceiptProps {
  receipt: SpotifyReceipt;
}

export const GitHubReceipt: React.FC<GitHubReceiptProps> = ({ receipt }) => {
  const topTracks = receipt.topTracks || [];
  // Calculate real streaming value
  const STREAM_RATE = 0.003; // Real Spotify rate per stream
  const totalStreams = topTracks.reduce((sum, track) => sum + (track.playCount || 0), 0);
  const realAmount = totalStreams * STREAM_RATE;
  const totalAmount = realAmount; // Use real streaming value
  const totalTime = receipt.totalDuration || 0;
  const currentDate = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const commitHash = ((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 0xFFFFFF).toString(16).padStart(7, '0');
  
  // Generate commit history from tracks
  const commits = useMemo(() => {
    return topTracks.map((track, index) => {
      const seed = (typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) + index;
      const playCount = track.playCount || 0;
      
      // Generate commit type and emoji based on index
      const emojis = ['✨', '🔥', '🚀', '💫', '⚡', '🎯', '💎', '🌟', '🎪', '🎭',
                      '🎨', '🏆', '💥', '🌈', '🦄', '🍾', '🎸', '🎹', '🥁', '🎺',
                      '🎻', '🎤', '🎧', '🎼', '🎵'];
      const emoji = emojis[index] || '🎶';

      let commitType = 'feat';
      if (playCount > 100) {
        commitType = 'feat';
      } else if (playCount > 75) {
        commitType = 'fix';
      } else if (playCount > 50) {
        commitType = 'refactor';
      } else if (playCount > 25) {
        commitType = 'docs';
      } else {
        commitType = 'chore';
      }
      
      // Generate commit hash from track name
      const trackHash = track.name || 'Unknown';
      const hash = trackHash.substring(0, Math.min(7, trackHash.length)).padEnd(7, '0');
      
      // Calculate additions and deletions based on duration
      const additions = Math.floor((track.duration || 0) / 1000);
      const deletions = Math.floor(additions * 0.3);
      
      return {
        hash,
        type: commitType,
        emoji,
        message: track.name || 'Unknown Track',
        author: track.artists?.[0]?.name || 'Unknown Artist',
        additions,
        deletions,
        plays: playCount,
        value: playCount * STREAM_RATE, // Real streaming value
        duration: track.duration || 0,
        timestamp: new Date(Date.now() - (index * 3600000)).toISOString()
      };
    });
  }, [topTracks, receipt.generatedAt]);
  
  // Calculate repository stats
  const totalCommits = commits.length;
  const totalAdditions = commits.reduce((sum, c) => sum + c.additions, 0);
  const totalDeletions = commits.reduce((sum, c) => sum + c.deletions, 0);
  const totalContributors = new Set(commits.map(c => c.author)).size;
  const totalPlays = commits.reduce((sum, c) => sum + c.plays, 0);
  
  // Generate activity graph - smaller grid with truly random colors
  const activityData = useMemo(() => {
    const weeks = 12; // 12 weeks (3 months)
    const days = 7;
    const data = [];

    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        // Use Math.random() for true randomness
        const random = Math.random();

        let intensity = 0;
        if (random < 0.30) intensity = 0;      // 30% black/grey
        else if (random < 0.55) intensity = 1; // 25% low green
        else if (random < 0.75) intensity = 2; // 20% medium green
        else if (random < 0.90) intensity = 3; // 15% bright green
        else intensity = 4;                    // 10% very bright

        data.push(intensity);
      }
    }

    return data;
  }, []);
  
  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <svg height="32" width="32" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </div>
            <span className={styles.repoPath}>github.com/you/music-addiction</span>
          </div>
          
          <div className={styles.repoInfo}>
            <div className={styles.repoName}>
              <span className={styles.repoIcon}>🎵</span>
              spotify-music / top-tracks-{currentDate.getFullYear()}
            </div>
            <div className={styles.repoBadges}>
              <span className={styles.badge}>⭐ {totalPlays} stars</span>
              <span className={styles.badge}>🎙️ {totalContributors} artist{totalContributors !== 1 ? 's' : ''}</span>
              <span className={styles.badge}>🔄 {totalCommits} commits</span>
            </div>
            <div className={styles.issueLabel}>Issue: "Can't stop listening" - Status: Won't Fix</div>
          </div>
          
          <div className={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          
          <div className={styles.sectionTitle}>📋 COMMIT HISTORY</div>
          
          <div className={styles.commits}>
            {commits.map((commit, index) => (
              <div key={index} className={styles.commit}>
                <div className={styles.commitHeader}>
                  <span className={styles.commitLabel}>commit: {commit.message}</span>
                </div>
                <div className={styles.commitAuthorLine}>Author: {commit.author}</div>
                <div className={styles.commitDate}>Date:   {new Date(commit.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <div className={styles.commitBody}>
                  <div className={styles.commitTitle}>{commit.emoji} {
                    index === 0 ? 'Fixed emotional state with this track' :
                    index === 1 ? 'Merged feelings into main branch' :
                    index === 2 ? 'Deployed dopamine successfully' :
                    index === 3 ? 'Refactored mood to happy' :
                    index === 4 ? 'Pushed vibes to production' :
                    index === 5 ? 'Compiled happiness without errors' :
                    index === 6 ? 'Resolved conflicts in heart' :
                    index === 7 ? 'Optimized emotional performance' :
                    index === 8 ? 'Patched vulnerability in soul' :
                    index === 9 ? 'Implemented new feature: joy' :
                    index === 10 ? 'Debugged anxiety successfully' :
                    index === 11 ? 'Committed to better mood' :
                    index === 12 ? 'Synchronized feelings with beat' :
                    index === 13 ? 'Upgraded mental state to v2.0' :
                    index === 14 ? 'Cached good memories' :
                    index === 15 ? 'Bootstrapped new playlist' :
                    index === 16 ? 'Migrated to happier database' :
                    index === 17 ? 'Restored backup of joy' :
                    index === 18 ? 'Initialized dance mode' :
                    index === 19 ? 'Validated feelings successfully' :
                    index === 20 ? 'Released endorphins to production' :
                    index === 21 ? 'Configured optimal mood settings' :
                    index === 22 ? 'Installed happiness package' :
                    index === 23 ? 'Rebooted emotional system' :
                    'Updated playlist dependencies'
                  }</div>
                  <div className={styles.commitDescription}>
                    <div>- Played {commit.plays} times</div>
                    <div>- Duration: {Math.floor(commit.duration / 60000)}:{((commit.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}</div>
                    <div>- Stream Value: €{commit.value.toFixed(2)}</div>
                  </div>
                </div>
                <div className={styles.commitDiff}>
                  <span className={styles.fileName}>life/social.js</span>
                  <span className={styles.separator}>|</span>
                  <span className={styles.additions}>{commit.additions} ++++</span>
                  <span className={styles.deletions}> {commit.deletions} ----</span>
                </div>
                <div className={styles.commitSummary}>
                  1 file changed, {commit.additions} insertions(+), {commit.deletions} deletions(-)
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          
          <div className={styles.activity}>
            <div className={styles.activityTitle}>📈 CONTRIBUTION ACTIVITY</div>
            <div className={styles.activityGraph}>
              <div className={styles.activityGrid}>
                {activityData.map((intensity, index) => (
                  <span
                    key={index}
                    className={`${styles.activityDay} ${styles[`intensity${intensity}`]}`}
                    title={`Activity level: ${intensity}`}
                  ></span>
                ))}
              </div>
              <div className={styles.activityLegend}>
                <span className={styles.legendText}>Less</span>
                <span className={`${styles.activityDay} ${styles.intensity0}`}></span>
                <span className={`${styles.activityDay} ${styles.intensity1}`}></span>
                <span className={`${styles.activityDay} ${styles.intensity2}`}></span>
                <span className={`${styles.activityDay} ${styles.intensity3}`}></span>
                <span className={`${styles.activityDay} ${styles.intensity4}`}></span>
                <span className={styles.legendText}>More</span>
              </div>
            </div>
          </div>
          
          <div className={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          
          <div className={styles.stats}>
            <div className={styles.statsTitle}>📊 REPOSITORY STATISTICS</div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Plays</div>
                <div className={styles.statValue}>{totalPlays.toLocaleString()}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Unique Artists</div>
                <div className={styles.statValue}>{totalContributors}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Listening Time</div>
                <div className={styles.statValue}>{formatDuration(totalTime)}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Tracks</div>
                <div className={styles.statValue}>{totalCommits}</div>
              </div>
            </div>
          </div>
          
          <div className={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          
          <div className={styles.pullRequest}>
            <div className={styles.prTitle}>
              <span className={styles.prIcon}>🔄</span>
              Pull Request #42: Merge music-2024 into main
            </div>
            <div className={styles.prStatus}>
              <span className={styles.prBadge}>✅ All checks passed</span>
              <span className={styles.prBadge}>👍 {totalContributors} approved</span>
              <span className={styles.prBadge}>🚀 Ready to merge</span>
            </div>
            <div className={styles.prChanges}>
              <div className={styles.prChange}>
                <span className={styles.additions}>+{totalAdditions} additions</span>
                <span className={styles.deletions}>-{totalDeletions} deletions</span>
              </div>
              <div className={styles.prFiles}>{totalCommits} files changed</div>
            </div>
          </div>
          
          <div className={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          
          <div className={styles.billing}>
            <div className={styles.billingTitle}>GITHUB ACTIONS USAGE</div>
            <div className={styles.billingItems}>
              <div className={styles.billingItem}>
                <span>Workflow Runs (Streams):</span>
                <span>{totalStreams.toLocaleString()}</span>
              </div>
              <div className={styles.billingItem}>
                <span>Cost per Run:</span>
                <span>€{STREAM_RATE}</span>
              </div>
              <div className={styles.billingItem}>
                <span>Compute Minutes:</span>
                <span>{Math.round(totalTime / 60000)} min</span>
              </div>
              <div className={styles.billingItem}>
                <span>Storage Used:</span>
                <span>{(totalStreams * 3.2 / 1024).toFixed(1)} GB</span>
              </div>
              <div className={styles.billingTotal}>
                <span>Total Streaming Value:</span>
                <span>€{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          
          <div className={styles.footer}>
            <div className={styles.footerItem}>Generated: {currentDate.toISOString()}</div>
            <div className={styles.footerItem}>Commit: {commitHash}</div>
            <div className={styles.footerItem}>Branch: main</div>
            <RickrollQRCode className={styles.qrCode} size={70} inverted={true} />
            <div className={styles.octocat}>
              <pre style={{fontFamily: 'monospace', fontSize: '10px', lineHeight: '1.2', color: '#8f98a0'}}>{`
 

________
_╓▄▓▓██████████████▓▌▄▄_
,▄▓██████████████████████████▓▄,
,▄██████████████████████████████████▌▄
 ▄████████████████████████████████████████▄_
▄████████████████████████████████████████████▌_
╓████████▀▀▀▀█████████████████████████▀▀▀████████▄
▓█████████      ╙▀██▓▀▀▀▀▀▀▀▀▀▀▓██▀╙      ╫████████▓_
▓█████████▌                                ╒██████████_
▓██████████▌                                ▐███████████_
╫███████████▀                                ╙████████████
███████████"                                   ███████████W
╫██████████M                                     ███████████
███████████                                      ███████████
███████████                                      ███████████
███████████⌐                                     ███████████
╫██████████▓                                    ╫███████████
"███████████▌                                  ▄███████████M
▓████████████╖                              ,▓████████████
██████████████▄,                        ,▄▓█████████████
█████▄_ └▀███████▓▌▄▄─           ▄▄▄▓█████████████████"
▓█████▓_  ▀████████Ñ            └███████████████████
╙██████w  └▀▓███▀▀              ╫████████████████▀
▀█████▄_                      ▐██████████████▓"
▀██████▌▄▄▄▄▄▄              ▐████████████▀"
╙▀█████████▌              ▐██████████▀
╙▀██████▌              ▐██████▀╙
└╙▀▀"              '▀▀▀╙

               `}</pre>
            </div>
            <div className={styles.copyright}>© {currentDate.getFullYear()} GitHub, Inc.</div>
          </div>
        </div>
      </div>
    </div>
  );
};