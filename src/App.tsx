import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Callback from './pages/Callback';
import Receipt from './pages/Receipt';
import authService from './services/auth/AuthService';
import './styles/global.css';

interface AppProps {
  initialAuth?: {
    isAuthenticated: boolean;
    accessToken?: string;
    expiresAt?: number;
  };
}

function App({ initialAuth }: AppProps = {}): React.ReactElement {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const authCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const authMonitorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check auth status on mount
  useEffect(() => {
    // Immediate check
    const status = authService.getAuthStatus();
    console.log('Initial auth status:', status);

    if (status.isAuthenticated) {
      setAuthState('authenticated');
      return;
    }

    // Give a brief moment for tokens to be restored from localStorage
    authCheckTimeoutRef.current = setTimeout(() => {
      const delayedStatus = authService.getAuthStatus();
      console.log('Delayed auth check:', delayedStatus);
      setAuthState(delayedStatus.isAuthenticated ? 'authenticated' : 'unauthenticated');
    }, 100);

    // Cleanup
    return () => {
      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
        authCheckTimeoutRef.current = null;
      }
    };
  }, []);

  // Continue checking for auth updates with debouncing
  useEffect(() => {
    if (authState === 'loading') return;

    // Check auth status every 2 seconds instead of 500ms
    authMonitorIntervalRef.current = setInterval(() => {
      const status = authService.getAuthStatus();
      const newState = status.isAuthenticated ? 'authenticated' : 'unauthenticated';
      if (newState !== authState) {
        console.log('Auth status changed to:', newState);
        setAuthState(newState);
      }
    }, 2000);

    return () => {
      if (authMonitorIntervalRef.current) {
        clearInterval(authMonitorIntervalRef.current);
        authMonitorIntervalRef.current = null;
      }
    };
  }, [authState]);

  // Always show loading spinner during initial load
  if (authState === 'loading') {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route
              path="/"
              element={
                authState === 'authenticated' ? (
                  <Navigate to="/receipt" replace />
                ) : (
                  <Home />
                )
              }
            />
            <Route
              path="/callback"
              element={<Callback onAuth={() => {
                console.log('App: onAuth callback triggered');
                // Force immediate authentication
                setAuthState('authenticated');
              }} />}
            />
            <Route
              path="/receipt"
              element={
                authState === 'authenticated' ? (
                  <Receipt onLogout={() => {
                    console.log('App: onLogout callback triggered');
                    setAuthState('unauthenticated');
                  }} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;