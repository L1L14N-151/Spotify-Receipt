import React, { useMemo } from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import { RickrollQRCode } from './QRCode';
import styles from './NASAReceipt.module.css';

interface NASAReceiptProps {
  receipt: ReceiptModel;
}

const NASAReceipt: React.FC<NASAReceiptProps> = ({ receipt }) => {
  const date = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const missionDate = date.toISOString().split('T')[0];
  const missionTime = date.toISOString().split('T')[1].split('.')[0];

  // Sort tracks by play count (signal strength)
  const sortedItems = [...receipt.items].sort((a, b) => {
    const playCountA = a.playCount || 0;
    const playCountB = b.playCount || 0;
    return playCountB - playCountA;
  });

  // Use all tracks as telemetry data
  const telemetryData = sortedItems;

  // Calculate mission parameters with real streaming price
  const pricePerStream = 0.003; // Real Spotify rate
  const totalStreams = sortedItems.reduce((sum, track) => sum + (track.playCount || 0), 0);
  const totalMissionCost = totalStreams * pricePerStream;
  const totalPlayTime = sortedItems.reduce((sum, track) => sum + (track.playCount || 0) * 3.5, 0); // minutes
  const orbitCount = Math.floor(totalPlayTime / 90); // 90 min per orbit
  const distanceTraveled = orbitCount * 42164; // km per orbit
  const dataTransmitted = sortedItems.reduce((sum, track) => sum + (track.playCount || 0) * 3.2, 0); // MB
  // Memoize random values based on receipt generation time to avoid re-renders
  const { signalDelay, missionCode, orbitNumber, frequencyBand } = useMemo(() => {
    const seed = typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now();
    const pseudoRandom = (index: number) => ((seed + index * 1337) % 1000) / 1000;

    return {
      signalDelay: pseudoRandom(1) * 14 + 1, // 1-15 minutes to Earth
      missionCode: `STS-${Math.floor(pseudoRandom(2) * 999)}`,
      orbitNumber: Math.floor(pseudoRandom(3) * 9999),
      frequencyBand: `${(pseudoRandom(4) * 10 + 2).toFixed(3)} GHz`
    };
  }, [receipt.generatedAt]);

  // System status checks
  const systems = [
    { name: 'LIFE SUPPORT', status: 'NOMINAL', value: 'OK' },
    { name: 'NAVIGATION', status: 'NOMINAL', value: 'OK' },
    { name: 'COMMUNICATIONS', status: 'NOMINAL', value: 'OK' },
    { name: 'FUEL CELLS', status: 'NOMINAL', value: '87%' },
    { name: 'SOLAR PANELS', status: 'NOMINAL', value: 'OK' },
    { name: 'ATTITUDE CTRL', status: 'NOMINAL', value: 'OK' },
    { name: 'THERMAL', status: 'WARNING', value: '45°C' },
    { name: 'O2 LEVELS', status: 'NOMINAL', value: '98%' }
  ];

  // Calculate signal strength based on play count relative to max
  const getSignalStrength = (playCount: number) => {
    const maxPlays = Math.max(...sortedItems.map(t => t.playCount || 0));
    if (maxPlays === 0) return { level: 'WEAK', class: styles.signalWeak };

    const ratio = playCount / maxPlays;
    if (ratio > 0.7) return { level: 'STRONG', class: styles.signalStrong };
    if (ratio > 0.3) return { level: 'MEDIUM', class: styles.signalMedium };
    return { level: 'WEAK', class: styles.signalWeak };
  };

  // Mission quotes
  const quotes = [
    { text: "Houston, we have a problem... with our playlist", source: "Apollo 13 Remix" },
    { text: "That's one small beat for man, one giant drop for mankind", source: "Apollo 11" },
    { text: "Failure is not an option... except for shuffle mode", source: "Mission Control" },
    { text: "The music is out there", source: "ISS Crew" }
  ];
  // Use stable quote selection
  const selectedQuote = useMemo(() => {
    const time = typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now();
    return quotes[time % quotes.length];
  }, [receipt.generatedAt]);

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.content}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.nasaLogo}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/2449px-NASA_logo.svg.png"
                alt="NASA Logo"
                className={styles.nasaSeal}
              />
            </div>
            <div className={styles.missionControl}>MISSION CONTROL - HOUSTON</div>
            <div className={styles.topSecret}>◼ CLASSIFIED ◼</div>
          </div>

          <div className={styles.separator}>{'▬'.repeat(40)}</div>

          {/* Mission Information */}
          <div className={styles.missionInfo}>
            <div className={styles.missionTitle}>Mission Parameters</div>

            <div className={styles.missionDetail}>
              <span className={styles.missionLabel}>MISSION ID:</span>
              <span className={styles.missionValue}>{missionCode}</span>
            </div>

            <div className={styles.missionDetail}>
              <span className={styles.missionLabel}>DATE:</span>
              <span className={styles.missionValue}>{missionDate}</span>
            </div>

            <div className={styles.missionDetail}>
              <span className={styles.missionLabel}>TIME (UTC):</span>
              <span className={styles.missionValue}>{missionTime}Z</span>
            </div>

            <div className={styles.missionDetail}>
              <span className={styles.missionLabel}>ORBIT #:</span>
              <span className={styles.missionValue}>{orbitNumber}</span>
            </div>

            <div className={styles.missionDetail}>
              <span className={styles.missionLabel}>FREQUENCY:</span>
              <span className={styles.missionValue}>{frequencyBand}</span>
            </div>

            <div className={styles.missionDetail}>
              <span className={styles.missionLabel}>CREW:</span>
              <span className={styles.missionValue}>SPOTIFY-1</span>
            </div>
          </div>

          <div className={styles.separator}>{'━'.repeat(40)}</div>

          {/* Telemetry Data */}
          <div className={styles.telemetrySection}>
            <div className={styles.sectionTitle}>◆ Telemetry Data Stream ◆</div>

            {telemetryData.map((track, idx) => {
              const signal = getSignalStrength(track.playCount || 0);
              const velocity = ((track.playCount || 0) * 7.8).toFixed(1);
              const altitude = ((track.playCount || 0) * 4.2).toFixed(0);
              // Use track-based pseudo-random for stable temperature
              const tempSeed = (track.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const temperature = ((tempSeed % 50) - 25).toFixed(1);
              const trackName = (track.name || 'UNKNOWN SIGNAL').toUpperCase().substring(0, 30);
              const artistName = track.artists?.[0]?.name?.toUpperCase().substring(0, 20) || 'UNKNOWN SOURCE';

              return (
                <div key={idx} className={styles.dataEntry}>
                  <div className={styles.entryHeader}>
                    <span className={styles.timestamp}>T+{String(idx).padStart(3, '0')}:{String(track.playCount || 0).padStart(3, '0')}</span>
                    <span className={`${styles.signalStrength} ${signal.class}`}>
                      SIGNAL: {signal.level}
                    </span>
                  </div>

                  <div className={styles.trackDesignation}>{trackName}</div>
                  <div className={styles.trackCallsign}>CALLSIGN: {artistName}</div>

                  <div className={styles.telemetryData}>
                    <div className={styles.telemetryItem}>
                      <div className={styles.telemetryLabel}>STREAMS</div>
                      <div className={styles.telemetryValue}>{(track.playCount || 0).toLocaleString()}</div>
                    </div>
                    <div className={styles.telemetryItem}>
                      <div className={styles.telemetryLabel}>VALUE</div>
                      <div className={styles.telemetryValue}>€{((track.playCount || 0) * pricePerStream).toFixed(2)}</div>
                    </div>
                    <div className={styles.telemetryItem}>
                      <div className={styles.telemetryLabel}>VELOCITY</div>
                      <div className={styles.telemetryValue}>{velocity} km/s</div>
                    </div>
                    <div className={styles.telemetryItem}>
                      <div className={styles.telemetryLabel}>ALTITUDE</div>
                      <div className={styles.telemetryValue}>{altitude} km</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.separator}>{'━'.repeat(40)}</div>

          {/* System Status */}
          <div className={styles.systemStatus}>
            <div className={styles.missionTitle}>System Status Check</div>

            <div className={styles.statusGrid}>
              {systems.map((system, idx) => (
                <div key={idx} className={styles.statusItem}>
                  <span className={styles.statusName}>{system.name}</span>
                  <span className={`${styles.statusValue} ${
                    system.status === 'NOMINAL' ? styles.statusOK :
                    system.status === 'WARNING' ? styles.statusWarning :
                    styles.statusCritical
                  }`}>
                    {system.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.separator}>{'━'.repeat(40)}</div>

          {/* Orbital Parameters */}
          <div className={styles.orbitParameters}>
            <div className={styles.orbitTitle}>Orbital Mechanics</div>

            <div className={styles.orbitGrid}>
              <div className={styles.orbitParam}>
                <div className={styles.paramName}>Apogee</div>
                <div className={styles.paramValue}>
                  {(400 + ((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 50)).toFixed(1)}
                  <span className={styles.paramUnit}>km</span>
                </div>
              </div>
              <div className={styles.orbitParam}>
                <div className={styles.paramName}>Perigee</div>
                <div className={styles.paramValue}>
                  {(380 + ((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 20)).toFixed(1)}
                  <span className={styles.paramUnit}>km</span>
                </div>
              </div>
              <div className={styles.orbitParam}>
                <div className={styles.paramName}>Inclination</div>
                <div className={styles.paramValue}>
                  {(51.6 + ((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 200) / 100).toFixed(2)}
                  <span className={styles.paramUnit}>°</span>
                </div>
              </div>
              <div className={styles.orbitParam}>
                <div className={styles.paramName}>Period</div>
                <div className={styles.paramValue}>
                  {(90 + ((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 50) / 10).toFixed(1)}
                  <span className={styles.paramUnit}>min</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.separator}>{'━'.repeat(40)}</div>

          {/* Command Sequence */}
          <div className={styles.commandSequence}>
            <div className={styles.commandTitle}>Command Sequence Log</div>
            <div className={styles.command}>EXEC: MUSIC_TELEMETRY_DOWNLINK</div>
            <div className={styles.command}>STAT: CONNECTION_ESTABLISHED</div>
            <div className={styles.command}>RECV: {telemetryData.length}_TRACKS_ACQUIRED</div>
            <div className={styles.command}>PROC: ANALYZING_LISTENING_PATTERNS</div>
            <div className={styles.command}>XMIT: DATA_PACKET_COMPLETE</div>
            <div className={styles.command}>CONF: HOUSTON_COPY_CONFIRMED</div>
          </div>

          {/* Mission Summary */}
          <div className={styles.missionSummary}>
            <div className={styles.summaryTitle}>Mission Summary</div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Total Tracks:</span>
              <span className={styles.summaryValue}>{sortedItems.length}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Play Time:</span>
              <span className={styles.summaryValue}>{totalPlayTime.toFixed(0)} min</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Orbits Completed:</span>
              <span className={styles.summaryValue}>{orbitCount}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Distance Traveled:</span>
              <span className={styles.summaryValue}>{distanceTraveled.toLocaleString()} km</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Data Transmitted:</span>
              <span className={styles.summaryValue}>{dataTransmitted.toFixed(1)} MB</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Signal Delay:</span>
              <span className={styles.summaryValue}>{signalDelay.toFixed(1)} min</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Total Streams:</span>
              <span className={styles.summaryValue}>{totalStreams.toLocaleString()}</span>
            </div>

            <div className={styles.totalMissionTime}>
              <span className={styles.totalLabel}>Mission Cost:</span>
              <span className={styles.totalValue}>€{totalMissionCost.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.separator}>{'━'.repeat(40)}</div>

          {/* Houston Quote */}
          <div className={styles.houstonQuote}>
            <div className={styles.quote}>"{selectedQuote.text}"</div>
            <div className={styles.quoteSource}>- {selectedQuote.source}</div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.separator}>{'▬'.repeat(40)}</div>

            <div className={styles.classification}>
              ◼◼◼ CLASSIFIED DOCUMENT ◼◼◼
            </div>

            <RickrollQRCode className={styles.qrCode} size={70} />

            <div className={styles.footerText}>
              NATIONAL AERONAUTICS AND SPACE ADMINISTRATION<br/>
              Johnson Space Center - Houston, TX 77058<br/>
              <br/>
              DEEP SPACE NETWORK COMMUNICATION<br/>
              Goldstone • Madrid • Canberra<br/>
              <br/>
              Mission ID: {missionCode}<br/>
              Transmission: {Math.floor(((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) * 7) % 99999)}<br/>
              Classification: FOR SPOTIFY EYES ONLY<br/>
            </div>

            <div className={styles.staticNoise}>
              ▓▒░ ░▒▓█ ▓▒░ ░▒▓ ▓▒░ ░▒▓█ ▓▒░ ░▒▓
            </div>

            <div className={styles.endTransmission}>
              *** END OF TRANSMISSION ***<br/>
              *** LOSS OF SIGNAL ***
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NASAReceipt;