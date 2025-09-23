import React from 'react';
import styles from './ThemeSelector.module.css';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { id: 'cvs', name: 'CVS Pharmacy', icon: '💊', description: 'Endless coupons' },
  { id: 'casino', name: 'Casino', icon: '🎰', description: 'Jackpot addiction' },
  { id: 'breakingbad', name: 'Breaking Bad', icon: '🧪', description: 'Los Pollos' },
  { id: 'nasa', name: 'NASA', icon: '🚀', description: 'Mission log' },
  { id: 'carrefour', name: 'Carrefour', icon: '🛒', description: 'Basic' },
  { id: 'matrix', name: 'Matrix', icon: '💚', description: 'Terminal' },
  { id: 'mcdonalds', name: 'McDonald\'s', icon: '🍔', description: 'I\'m lovin\' it' },
  { id: 'gaming', name: 'Steam', icon: '🎮', description: 'Gaming' },
  { id: 'polaroid', name: 'Polaroid', icon: '📸', description: 'Memories' },
  { id: 'github', name: 'GitHub', icon: '💻', description: 'Commits' },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const availableThemes = ['cvs', 'casino', 'breakingbad', 'nasa', 'carrefour', 'matrix', 'mcdonalds', 'gaming', 'polaroid', 'github']; // All themes are now available
  const isDemo = window.location.pathname === '/demo';

  return (
    <div className={styles.themeSelector}>
      <h3 className={styles.title}>Choose Theme</h3>
      {currentTheme === 'polaroid' && isDemo && (
        <div className={styles.polaroidNote}>
          <span className={styles.noteIcon}>ℹ️</span>
          <span className={styles.noteText}>In Demo Mode, Polaroid uses random images. With Spotify login, it displays real album covers.</span>
        </div>
      )}
      <div className={styles.themeGrid}>
        {themes.map((theme) => {
          const isAvailable = availableThemes.includes(theme.id);
          return (
            <button
              key={theme.id}
              className={`${styles.themeButton} ${
                currentTheme === theme.id ? styles.active : ''
              } ${!isAvailable ? styles.disabled : ''}`}
              onClick={() => isAvailable && onThemeChange(theme.id)}
              disabled={!isAvailable}
              aria-label={`Select ${theme.name} theme`}
            >
              <span className={styles.themeIcon}>{theme.icon}</span>
              <span className={styles.themeName}>{theme.name}</span>
              <span className={styles.themeDescription}>{theme.description}</span>
              {!isAvailable && (
                <span className={styles.comingSoon}>Soon</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;