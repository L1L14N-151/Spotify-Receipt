import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import ThemedReceipt from '../components/Receipt/ThemedReceipt';
import ThemeSelector from '../components/ThemeSelector/ThemeSelector';
import ExportButton from '../components/ExportButton/ExportButton';
import spotifyDataService from '../services/spotify/SpotifyDataService';
import receiptService from '../services/receipt/ReceiptService';
import themeService from '../services/theme/ThemeService';
import authService from '../services/auth/AuthService';
import { TimeRange } from '../types';
import styles from './Receipt.module.css';
import spotifyReceiptLogo from '../assets/spotify-receipt-logo.png';

interface ReceiptPageProps {
  onLogout?: () => void;
}

const ReceiptPage: React.FC<ReceiptPageProps> = ({ onLogout }) => {
  const { state, dispatch } = useContext(AppContext);

  // Use a ref to track if we've fetched data for this session to avoid module-level state
  const hasInitialFetchRef = useRef(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Initial loading state
  const [isLoading, setIsLoading] = useState(false); // Regular loading for subsequent fetches
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
  const [currentTheme, setCurrentTheme] = useState('cvs');
  const [trackLimit, setTrackLimit] = useState(25);
  const [allTracks, setAllTracks] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<{ displayName?: string; imageUrl?: string | null } | null>(null);
  const allTracksRef = useRef<any[]>([]);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref when allTracks changes
  useEffect(() => {
    allTracksRef.current = allTracks;
  }, [allTracks]);

  const generateReceiptWithParams = (tracks: any[], theme: string, limit: number, range: TimeRange) => {
    const limitedTracks = tracks.slice(0, limit);
    const themeObj = themeService.getTheme(theme) || themeService.getDefaultTheme();
    const receipt = receiptService.generateReceipt(limitedTracks, themeObj, range);
    dispatch({ type: 'SET_RECEIPT', payload: receipt });
    dispatch({ type: 'SET_TRACKS', payload: limitedTracks });
  };

  const fetchTopTracks = async (range: TimeRange, forceRefresh: boolean = false, isInitial: boolean = false) => {
    console.log('fetchTopTracks called:', { range, forceRefresh, isInitial, hasExisting: allTracksRef.current.length > 0 });

    // Don't fetch if we already have tracks and not forcing refresh
    if (!forceRefresh && allTracksRef.current.length > 0) {
      // Just regenerate the receipt with existing tracks
      generateReceiptWithParams(allTracksRef.current, currentTheme, trackLimit, range);
      if (isInitial) setIsInitialLoading(false);
      return;
    }

    if (!isInitial) setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching tracks from Spotify...');
      const tracks = await spotifyDataService.getTopTracks(range, 25);
      console.log('Tracks received:', tracks.length);

      if (tracks.length > 0) {
        setAllTracks(tracks);
        allTracksRef.current = tracks;
        // Generate receipt automatically with current settings
        generateReceiptWithParams(tracks, currentTheme, trackLimit, range);
        setIsInitialLoading(false);
      }
      // Don't show error if no tracks, just keep loading state
    } catch (err) {
      console.error('Error fetching tracks:', err);
      // Don't set error, just keep retrying
      setTimeout(() => {
        fetchTopTracks(range, true, isInitial);
      }, 1000);
    } finally {
      if (allTracksRef.current.length > 0) {
        setIsLoading(false);
        if (isInitial) setIsInitialLoading(false);
      }
    }
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await spotifyDataService.getUserProfile();
      if (profile) {
        setUserProfile(profile);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch tracks on mount if we haven't already
  useEffect(() => {
    if (!hasInitialFetchRef.current) {
      hasInitialFetchRef.current = true;
      console.log('Initial fetch on mount');
      const token = authService.getAccessToken();
      console.log('Token check before initial fetch:', !!token);
      if (token) {
        fetchTopTracks(timeRange, true, true); // Force fetch on mount with isInitial=true
      } else {
        // Keep retrying until we get a token
        retryIntervalRef.current = setInterval(() => {
          const retryToken = authService.getAccessToken();
          console.log('Retry token check:', !!retryToken);
          if (retryToken) {
            if (retryIntervalRef.current) {
              clearInterval(retryIntervalRef.current);
              retryIntervalRef.current = null;
            }
            fetchTopTracks(timeRange, true, true);
          }
        }, 500);
      }
    }

    // Cleanup function
    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    dispatch({ type: 'SET_TIME_RANGE', payload: range });
    fetchTopTracks(range, true); // Force fetch new tracks when time range changes
  };

  const handleThemeChange = (themeId: string) => {
    if (themeId === currentTheme) return;
    setCurrentTheme(themeId);
    dispatch({ type: 'SET_THEME', payload: themeId });

    // Regenerate receipt with new theme
    if (allTracks.length > 0) {
      generateReceiptWithParams(allTracks, themeId, trackLimit, timeRange);
    }
  };

  const handleTrackLimitChange = (limit: number) => {
    if (limit === trackLimit) return;
    setTrackLimit(limit);

    // Regenerate receipt with new track limit
    if (allTracks.length > 0) {
      generateReceiptWithParams(allTracks, currentTheme, limit, timeRange);
    }
  };

  const handleLogout = () => {
    hasInitialFetchRef.current = false; // Reset for next login
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }
    authService.logout();
    if (onLogout) onLogout();
  };

  const handleGenerateReceipt = () => {
    if (allTracks.length > 0) {
      generateReceiptWithParams(allTracks, currentTheme, trackLimit, timeRange);
    }
  };

  return (
    <div className={styles.receiptPage}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <img src={spotifyReceiptLogo} alt="Spotify Receipt" className={styles.logo} />
          <h1 className={styles.title}>Your Spotify Receipt</h1>
        </div>
        <div className={styles.userSection}>
          {userProfile?.imageUrl ? (
            <img
              src={userProfile.imageUrl}
              alt={userProfile.displayName || 'User'}
              className={styles.userAvatar}
            />
          ) : (
            <svg className={styles.userIcon} viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          )}
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.timeRangeSelector}>
            <label htmlFor="timeRange">Time Range:</label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
              className={styles.select}
            >
              <option value="short_term">Last 4 Weeks</option>
              <option value="medium_term">Last 6 Months</option>
              <option value="long_term">All Time</option>
            </select>
          </div>

          <div className={styles.trackLimitSelector}>
            <label htmlFor="trackLimit">Number of Tracks:</label>
            <select
              id="trackLimit"
              value={trackLimit}
              onChange={(e) => handleTrackLimitChange(Number(e.target.value))}
              className={styles.select}
            >
              <option value="5">5 Tracks</option>
              <option value="10">10 Tracks</option>
              <option value="15">15 Tracks</option>
              <option value="20">20 Tracks</option>
              <option value="25">25 Tracks</option>
            </select>
          </div>
        </div>

        <div className={styles.exportSection}>
          <ExportButton />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.receiptContainer}>
          {(isInitialLoading || isLoading) ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading your top tracks...</p>
            </div>
          ) : state.receipt ? (
            <ThemedReceipt receipt={state.receipt} theme={currentTheme} />
          ) : null}
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

export default ReceiptPage;