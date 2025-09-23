import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ThemedReceipt from '../components/Receipt/ThemedReceipt';
import ThemeSelector from '../components/ThemeSelector/ThemeSelector';
import ExportButton from '../components/ExportButton/ExportButton';
import receiptService from '../services/receipt/ReceiptService';
import themeService from '../services/theme/ThemeService';
import { TimeRange, SpotifyTrack } from '../types';
import styles from './Receipt.module.css';
import spotifyReceiptLogo from '../assets/spotify-receipt-logo.png';

const Demo: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);

  const [currentTheme, setCurrentTheme] = useState('cvs');
  const [trackLimit, setTrackLimit] = useState<5 | 10 | 15 | 20 | 25>(10);
  const [editMode, setEditMode] = useState(false);
  const [customTracks, setCustomTracks] = useState<Array<{ name: string; artist: string; playCount: number }>>([]);

  // Initialize with default tracks
  const defaultTracks = [
    { name: "Flowers", artist: "Miley Cyrus", playCount: 127 },
    { name: "As It Was", artist: "Harry Styles", playCount: 89 },
    { name: "Unholy", artist: "Sam Smith & Kim Petras", playCount: 76 },
    { name: "Kill Bill", artist: "SZA", playCount: 65 },
    { name: "Anti-Hero", artist: "Taylor Swift", playCount: 58 },
    { name: "Cruel Summer", artist: "Taylor Swift", playCount: 52 },
    { name: "Paint The Town Red", artist: "Doja Cat", playCount: 47 },
    { name: "Vampire", artist: "Olivia Rodrigo", playCount: 43 },
    { name: "Seven", artist: "Jung Kook feat. Latto", playCount: 38 },
    { name: "What Was I Made For?", artist: "Billie Eilish", playCount: 35 },
    { name: "Greedy", artist: "Tate McRae", playCount: 32 },
    { name: "Strangers", artist: "Kenya Grace", playCount: 29 },
    { name: "Water", artist: "Tyla", playCount: 27 },
    { name: "Snooze", artist: "SZA", playCount: 24 },
    { name: "Lovin On Me", artist: "Jack Harlow", playCount: 22 },
    { name: "Agora Hills", artist: "Doja Cat", playCount: 19 },
    { name: "Monaco", artist: "Bad Bunny", playCount: 17 },
    { name: "Ella Baila Sola", artist: "Eslabon Armado", playCount: 15 },
    { name: "Daylight", artist: "David Kushner", playCount: 13 },
    { name: "Houdini", artist: "Dua Lipa", playCount: 11 },
    { name: "Is It Over Now?", artist: "Taylor Swift", playCount: 9 },
    { name: "Lala", artist: "Myke Towers", playCount: 7 },
    { name: "Used To Be Young", artist: "Miley Cyrus", playCount: 5 },
    { name: "Moonlight", artist: "Kali Uchis", playCount: 3 },
    { name: "BZRP Music Sessions #53", artist: "Shakira & Bizarrap", playCount: 2 }
  ];

  useEffect(() => {
    // Initialize custom tracks with default tracks
    if (customTracks.length === 0) {
      setCustomTracks(defaultTracks);
    }
  }, []);

  // Generate receipt whenever tracks or theme changes
  useEffect(() => {
    if (customTracks.length > 0) {
      generateReceipt();
    }
  }, [customTracks, currentTheme, trackLimit]);

  const generateReceipt = () => {
    // Convert custom tracks to SpotifyTrack format
    const spotifyTracks: SpotifyTrack[] = customTracks.slice(0, trackLimit).map((track, index) => ({
      id: `demo-${index}`,
      name: track.name,
      artists: [{ name: track.artist }],
      album: {
        name: "Demo Album",
        images: [
          {
            url: `https://picsum.photos/seed/${track.name}/640/640`,
            height: 640,
            width: 640
          }
        ]
      },
      durationMs: 180000 + Math.floor(Math.random() * 120000), // 3-5 minutes
      playCount: track.playCount,
      albumArtUrl: `https://picsum.photos/seed/${track.name}/640/640`
    }));

    const themeObj = themeService.getTheme(currentTheme) || themeService.getDefaultTheme();
    const receipt = receiptService.generateReceipt(spotifyTracks, themeObj, 'medium_term' as TimeRange);

    dispatch({ type: 'SET_RECEIPT', payload: receipt });
    dispatch({ type: 'SET_TRACKS', payload: spotifyTracks });
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    dispatch({ type: 'SET_THEME', payload: themeId });
  };

  const handleTrackLimitChange = (limit: 5 | 10 | 15 | 20 | 25) => {
    setTrackLimit(limit);
  };

  const handleTrackEdit = (index: number, field: 'name' | 'artist' | 'playCount', value: string | number) => {
    const updatedTracks = [...customTracks];
    if (field === 'playCount') {
      updatedTracks[index][field] = Number(value);
    } else {
      updatedTracks[index][field] = value as string;
    }
    setCustomTracks(updatedTracks);
  };

  const handleExitDemo = () => {
    navigate('/');
  };

  const handleResetTracks = () => {
    setCustomTracks(defaultTracks);
  };

  return (
    <div className={styles.receiptPage}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <img src={spotifyReceiptLogo} alt="Spotify Receipt" className={styles.logo} />
          <h1 className={styles.title}>Demo Mode</h1>
        </div>
        <div className={styles.userSection}>
          <span className={styles.demoBadge}>🎮 Guest Mode</span>
          <button onClick={handleExitDemo} className={styles.logoutButton}>
            Exit Demo
          </button>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.trackLimitSelector}>
            <label>Tracks:</label>
            <div className={styles.trackLimitControls}>
              <div className={styles.presetButtons}>
                <button
                  onClick={() => handleTrackLimitChange(5)}
                  className={`${styles.presetButton} ${trackLimit === 5 ? styles.active : ''}`}
                >
                  5
                </button>
                <button
                  onClick={() => handleTrackLimitChange(10)}
                  className={`${styles.presetButton} ${trackLimit === 10 ? styles.active : ''}`}
                >
                  10
                </button>
                <button
                  onClick={() => handleTrackLimitChange(15)}
                  className={`${styles.presetButton} ${trackLimit === 15 ? styles.active : ''}`}
                >
                  15
                </button>
                <button
                  onClick={() => handleTrackLimitChange(20)}
                  className={`${styles.presetButton} ${trackLimit === 20 ? styles.active : ''}`}
                >
                  20
                </button>
                <button
                  onClick={() => handleTrackLimitChange(25)}
                  className={`${styles.presetButton} ${trackLimit === 25 ? styles.active : ''}`}
                >
                  25
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditMode(!editMode)}
            className={`${styles.editButton} ${editMode ? styles.active : ''}`}
            style={{ marginLeft: '1rem' }}
          >
            {editMode ? '✓ Save' : '✏️ Edit Tracks'}
          </button>

          <button
            onClick={handleResetTracks}
            className={styles.resetButton}
            style={{ marginLeft: '0.5rem' }}
          >
            ↻ Reset
          </button>
        </div>

        <div className={styles.exportSection}>
          <ExportButton />
        </div>
      </div>

      {editMode && (
        <div className={styles.editPanel}>
          <h3 className={styles.editPanelTitle}>Edit Tracks (Top {trackLimit} will be shown)</h3>
          <div className={styles.tracksEditor}>
            {customTracks.slice(0, 25).map((track, index) => (
              <div key={index} className={`${styles.trackEditRow} ${index < trackLimit ? styles.active : styles.inactive}`}>
                <span className={styles.trackNumber}>{index + 1}.</span>
                <input
                  type="text"
                  value={track.name}
                  onChange={(e) => handleTrackEdit(index, 'name', e.target.value)}
                  placeholder="Track name"
                  className={`${styles.trackInput} ${styles.trackNameInput}`}
                />
                <input
                  type="text"
                  value={track.artist}
                  onChange={(e) => handleTrackEdit(index, 'artist', e.target.value)}
                  placeholder="Artist"
                  className={`${styles.trackInput} ${styles.trackArtistInput}`}
                />
                <input
                  type="number"
                  value={track.playCount}
                  onChange={(e) => handleTrackEdit(index, 'playCount', e.target.value)}
                  placeholder="Plays"
                  min="1"
                  max="999"
                  className={`${styles.trackInput} ${styles.trackPlaysInput}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.receiptContainer}>
          {state.receipt && (
            <ThemedReceipt receipt={state.receipt} theme={currentTheme} />
          )}
        </div>

        <div className={styles.sidePanel}>
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Demo;