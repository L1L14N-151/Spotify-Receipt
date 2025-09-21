import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/auth/AuthService';
import styles from './Callback.module.css';

interface CallbackProps {
  onAuth: () => void;
}

const Callback: React.FC<CallbackProps> = ({ onAuth }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      console.log('Callback received:', {
        hasCode: !!code,
        hasState: !!state,
        statePrefix: state ? state.substring(0, 8) + '...' : 'none',
        error
      });

      if (error) {
        setError(`Authentication cancelled: ${error}`);
        setIsProcessing(false);
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      if (!code || !state) {
        // No code/state means invalid callback, redirect to home immediately
        console.log('Missing callback params');
        navigate('/');
        return;
      }

      try {
        const result = await authService.handleCallback(code, state);

        if (result.success) {
          console.log('Authentication successful, verifying token...');

          // Verify token is available
          const token = authService.getAccessToken();
          console.log('Token available after callback:', !!token);

          if (token) {
            // Call onAuth immediately
            onAuth();
            // Navigate immediately - the app will handle the auth state
            console.log('Navigating to receipt page...');
            navigate('/receipt');
          } else {
            setError('Token storage failed. Please try again.');
            setTimeout(() => navigate('/'), 2000);
          }
        } else {
          setError(result.error || 'Authentication failed');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('Connection error. Please try again.');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, onAuth]);

  return (
    <div className={styles.callbackContainer}>
      <div className={styles.content}>
        {isProcessing ? (
          <>
            <div className={styles.spinner}></div>
            <h2>Authenticating with Spotify...</h2>
            <p>Please wait while we complete the authentication process.</p>
          </>
        ) : error ? (
          <>
            <div className={styles.errorIcon}>⚠️</div>
            <h2>Authentication Failed</h2>
            <p className={styles.errorMessage}>{error}</p>
            <p>Redirecting to home page...</p>
          </>
        ) : (
          <>
            <div className={styles.successIcon}>✓</div>
            <h2>Authentication Successful!</h2>
            <p>Redirecting to your receipt...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Callback;