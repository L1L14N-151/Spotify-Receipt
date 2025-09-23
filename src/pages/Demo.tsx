import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ThemedReceipt from '../components/Receipt/ThemedReceipt';
import ThemeSelector from '../components/ThemeSelector/ThemeSelector';
import ExportButton from '../components/ExportButton/ExportButton';
import { demoDataService, DemoTrackInput } from '../services/demo/DemoDataService';
import themeService from '../services/theme/ThemeService';
import receiptService from '../services/receipt/ReceiptService';
import spotifyReceiptLogo from '../assets/spotify-receipt-logo.png';
import styles from './Receipt.module.css';

const Demo: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const { receipt } = state;

  const [currentTheme, setCurrentTheme] = useState('cvs');
  const [trackLimit, setTrackLimit] = useState(10);
  const [customMode, setCustomMode] = useState(false);
  const [customTracks, setCustomTracks] = useState<DemoTrackInput[]>([]);
  const [newTrack, setNewTrack] = useState({ name: '', artist: '', playCount: 50 });

  // Generate demo receipt
  const generateDemoReceipt = () => {
    const tracks = customTracks.length > 0
      ? demoDataService.mixTracks(customTracks, trackLimit)
      : demoDataService.generatePresetTracks(trackLimit);

    const themeObj = themeService.getTheme(currentTheme) || themeService.getDefaultTheme();
    const demoReceipt = receiptService.generateReceipt(tracks, themeObj, 'medium_term');

    dispatch({ type: 'SET_RECEIPT', payload: demoReceipt });
    dispatch({ type: 'SET_TRACKS', payload: tracks.slice(0, trackLimit) });
  };

  // Generate initial demo receipt
  useEffect(() => {
    generateDemoReceipt();
  }, [trackLimit, currentTheme, customTracks]);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    dispatch({ type: 'SET_THEME', payload: themeId });
  };

  const handleTrackLimitChange = (limit: number) => {
    setTrackLimit(limit);
  };

  const handleAddCustomTrack = () => {
    if (newTrack.name && newTrack.artist) {
      setCustomTracks([...customTracks, newTrack]);
      setNewTrack({ name: '', artist: '', playCount: 50 });
    }
  };

  const handleRemoveCustomTrack = (index: number) => {
    setCustomTracks(customTracks.filter((_, i) => i !== index));
  };

  const handleResetToPreset = () => {
    setCustomTracks([]);
    setCustomMode(false);
  };

  const handleExitDemo = () => {
    navigate('/');
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
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Number of Tracks</label>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="1"
                max="25"
                value={trackLimit}
                onChange={(e) => handleTrackLimitChange(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.sliderValue}>{trackLimit}</span>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <button
              onClick={() => setCustomMode(!customMode)}
              className={styles.customButton}
            >
              {customMode ? '📝 Custom Tracks' : '🎵 Preset Tracks'}
            </button>
            {customTracks.length > 0 && (
              <button onClick={handleResetToPreset} className={styles.resetButton}>
                Reset to Preset
              </button>
            )}
          </div>

          {customMode && (
            <div className={styles.customTrackForm}>
              <h3>Add Custom Track</h3>
              <input
                type="text"
                placeholder="Song name"
                value={newTrack.name}
                onChange={(e) => setNewTrack({ ...newTrack, name: e.target.value })}
                className={styles.customInput}
              />
              <input
                type="text"
                placeholder="Artist"
                value={newTrack.artist}
                onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                className={styles.customInput}
              />
              <input
                type="number"
                placeholder="Play count"
                min="1"
                max="999"
                value={newTrack.playCount}
                onChange={(e) => setNewTrack({ ...newTrack, playCount: Number(e.target.value) })}
                className={styles.customInput}
              />
              <button onClick={handleAddCustomTrack} className={styles.addButton}>
                Add Track
              </button>

              {customTracks.length > 0 && (
                <div className={styles.customTrackList}>
                  <h4>Your Custom Tracks:</h4>
                  {customTracks.map((track, index) => (
                    <div key={index} className={styles.customTrackItem}>
                      <span>{track.name} - {track.artist} ({track.playCount}×)</span>
                      <button
                        onClick={() => handleRemoveCustomTrack(index)}
                        className={styles.removeButton}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <ExportButton receiptRef={null} />
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.receiptWrapper}>
          {receipt && <ThemedReceipt receipt={receipt} theme={currentTheme} />}
        </div>

        <div className={styles.sidePanel}>
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
          />
        </div>
      </div>

      <div className={styles.demoNote}>
        <p>
          <strong>Demo Mode:</strong> Using sample data for demonstration.
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            {' '}Login with Spotify
          </a> to use your real listening data!
        </p>
      </div>
    </div>
  );
};

export default Demo;