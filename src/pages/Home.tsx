import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyAuth from '../components/SpotifyAuth/SpotifyAuth';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate('/demo');
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Your Spotify Receipt
        </h1>
        <p className={styles.subtitle}>
          Transform your listening history into shareable receipts
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span className={styles.featureText}>Top Tracks</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎨</span>
            <span className={styles.featureText}>10+ Themes</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💾</span>
            <span className={styles.featureText}>Export PNG</span>
          </div>
        </div>

        <SpotifyAuth />

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button
          onClick={handleDemoClick}
          className={styles.demoButton}
        >
          Try Demo Mode
        </button>

        <p className={styles.privacy}>
          <span className={styles.privacyIcon}>🔒</span>
          We don't store your data • Everything stays in your browser
        </p>
      </div>
    </div>
  );
};

export default Home;