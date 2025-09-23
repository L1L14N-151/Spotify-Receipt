import React from 'react';
import authService from '../../services/auth/AuthService';
import styles from './SpotifyAuth.module.css';

interface SpotifyAuthProps {
  onAuthStart?: () => void;
  onAuthError?: (error: string) => void;
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({
  onAuthStart,
  onAuthError
}) => {
  const handleLogin = async () => {
    try {
      // Clear any stale session data before starting fresh
      sessionStorage.clear();
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_expires_at');
      localStorage.removeItem('spotify_user_id');

      if (onAuthStart) {
        onAuthStart();
      }
      await authService.login();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      if (onAuthError) {
        onAuthError(message);
      }
      console.error('Auth error:', error);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.warningBox}>
        <span className={styles.warningIcon}>⚠️</span>
        <div className={styles.warningText}>
          <strong>Spotify Login Temporarily Unavailable</strong>
          <p>Due to Spotify API limitations (25 user max), please use Demo Mode below to explore all features</p>
        </div>
      </div>
      <button
        className={`${styles.authButton} ${styles.disabled}`}
        onClick={(e) => e.preventDefault()}
        aria-label="Connect with Spotify (Disabled)"
        disabled
      >
        <svg
          className={styles.spotifyLogo}
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24"
          height="24"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.25-3.011-1.84-6.813-2.26-11.282-1.24-.451.101-.901-.189-1.001-.64-.101-.451.189-.901.64-1.001 4.899-1.12 9.104-.64 12.494 1.43.38.24.49.721.25 1.101zm1.47-3.271c-.301.471-.931.621-1.401.32-3.451-2.12-8.703-2.73-12.774-1.49-.551.17-1.131-.141-1.301-.69-.17-.551.141-1.131.69-1.301 4.661-1.42 10.454-.73 14.466 1.7.471.301.621.931.32 1.401zm.14-3.401C15.19 8.086 8.807 7.836 5.156 8.936c-.661.2-1.361-.17-1.561-.83-.2-.66.17-1.36.83-1.561 4.181-1.27 11.134-.98 15.524 1.72.53.32.7 1.02.38 1.55-.32.53-1.02.7-1.55.38z"/>
        </svg>
        <span>Connect with Spotify</span>
      </button>
    </div>
  );
};

export default SpotifyAuth;