/**
 * Authentication Service
 * Handles Spotify OAuth 2.0 with PKCE flow
 */

import { IAuthService, AuthResult, AuthStatus, TokenData } from './types';

export class AuthService implements IAuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;
  private codeVerifier: string | null = null;
  private state: string | null = null;
  private userId: string | null = null;

  private readonly clientId: string;
  private readonly redirectUri: string;
  private readonly scopes: string[];

  constructor(config?: { clientId?: string; redirectUri?: string }) {
    this.clientId = config?.clientId || import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
    // Automatically detect the correct redirect URI based on the current URL
    this.redirectUri = config?.redirectUri || import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`;
    this.scopes = ['user-top-read', 'user-read-private'];

    // Validate required environment variables
    if (!this.clientId) {
      console.error('CRITICAL: Missing VITE_SPOTIFY_CLIENT_ID environment variable');
      console.error('Please create a .env file with: VITE_SPOTIFY_CLIENT_ID=your_client_id_here');
      throw new Error('Missing required Spotify Client ID. Check console for details.');
    }

    // Try to restore session from localStorage on instantiation
    this.restoreSession();
  }

  async login(): Promise<void> {
    // Clear any old session data first
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('pkce_code_verifier');

    // Generate PKCE values
    const verifier = this.generateCodeVerifier();
    const challenge = await this.generateCodeChallenge(verifier);
    const state = this.generateState();

    // Store for callback
    this.storeCodeVerifier(verifier);
    this.storeState(state);

    console.log('Login initiated with state:', state.substring(0, 8) + '...');

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      state: state,
      code_challenge_method: 'S256',
      code_challenge: challenge
    });

    // Redirect to Spotify
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleCallback(code: string, state: string): Promise<AuthResult> {
    try {
      // Check if we already have a valid token (duplicate callback)
      const existingToken = this.getAccessToken();
      if (existingToken) {
        console.log('Already authenticated, ignoring duplicate callback');
        return {
          success: true,
          accessToken: existingToken,
          expiresIn: this.expiresAt ? Math.floor((this.expiresAt - Date.now()) / 1000) : 3600
        };
      }

      // Get stored state from sessionStorage or memory BEFORE clearing
      const storedState = this.state || sessionStorage.getItem('oauth_state');

      // Validate state
      if (!storedState || state !== storedState) {
        console.log('State mismatch:', { provided: state, stored: storedState });
        // Don't clear auth data here - might be a duplicate callback
        return {
          success: false,
          error: 'Session expired. Please try logging in again'
        };
      }

      // Clear stored state only after validation
      sessionStorage.removeItem('oauth_state');

      // Get stored code verifier
      const verifier = this.getStoredCodeVerifier();
      if (!verifier) {
        return {
          success: false,
          error: 'No code verifier found'
        };
      }

      // Exchange code for token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          code_verifier: verifier
        })
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Token exchange failed: ${error}`
        };
      }

      const data = await response.json();

      // Store tokens IMMEDIATELY and ensure they're in memory
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token || null;
      this.expiresAt = Date.now() + (data.expires_in * 1000);

      // Also store in localStorage for persistence
      this.storeTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in
      });

      console.log('Authentication successful, token stored');

      return {
        success: true,
        accessToken: data.access_token,
        expiresIn: data.expires_in
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  getAuthStatus(): AuthStatus {
    // Try to get the token (which also restores from localStorage if needed)
    const token = this.getAccessToken();
    const isAuthenticated = token !== null;

    return {
      isAuthenticated,
      expiresAt: this.expiresAt || undefined,
      userId: this.userId || undefined
    };
  }

  logout(): void {
    this.clearAuthData();
  }

  private clearAuthData(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.userId = null;
    this.codeVerifier = null;
    this.state = null;

    // Clear localStorage
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_expires_at');
    localStorage.removeItem('spotify_user_id');
  }

  private clearSessionData(): void {
    // Clear only session-related data, not auth tokens
    // Don't clear here as we need them for validation
    this.codeVerifier = null;
    this.state = null;
  }

  getAccessToken(): string | null {
    // First check memory
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      console.log('Token found in memory');
      return this.accessToken;
    }

    // Try to restore from localStorage if not in memory
    const storedToken = localStorage.getItem('spotify_access_token');
    const storedExpiresAt = localStorage.getItem('spotify_expires_at');
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token');

    console.log('Checking localStorage:', {
      hasToken: !!storedToken,
      hasExpiresAt: !!storedExpiresAt,
      hasRefreshToken: !!storedRefreshToken
    });

    if (storedToken && storedExpiresAt) {
      const expiresAt = parseInt(storedExpiresAt, 10);
      if (Date.now() < expiresAt) {
        // Restore everything to memory
        this.accessToken = storedToken;
        this.refreshToken = storedRefreshToken;
        this.expiresAt = expiresAt;
        console.log('Token restored from localStorage, valid until:', new Date(expiresAt));
        return storedToken;
      } else {
        console.log('Token in localStorage is expired');
      }
    }

    console.log('No valid token available');
    return null;
  }

  generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const verifier = this.base64UrlEncode(array);
    return verifier;
  }

  async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(digest));
  }

  private base64UrlEncode(array: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...array));
    return base64
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  storeCodeVerifier(verifier: string): void {
    this.codeVerifier = verifier;
    // Could also use sessionStorage for persistence across page refresh
    sessionStorage.setItem('pkce_code_verifier', verifier);
  }

  getStoredCodeVerifier(): string | null {
    if (this.codeVerifier) return this.codeVerifier;

    // Try to recover from sessionStorage
    const stored = sessionStorage.getItem('pkce_code_verifier');
    if (stored) {
      this.codeVerifier = stored;
      sessionStorage.removeItem('pkce_code_verifier');
    }
    return this.codeVerifier;
  }

  generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  storeState(state: string): void {
    this.state = state;
    sessionStorage.setItem('oauth_state', state);
  }

  storeTokens(tokens: TokenData): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken || this.refreshToken;
    this.expiresAt = Date.now() + (tokens.expiresIn * 1000);

    // Store in localStorage for persistence
    localStorage.setItem('spotify_access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('spotify_refresh_token', tokens.refreshToken);
    }
    localStorage.setItem('spotify_expires_at', this.expiresAt.toString());
  }

  getRedirectUri(): string {
    return this.redirectUri;
  }

  async buildAuthorizationUrl(scopes?: string[]): Promise<string> {
    const verifier = this.generateCodeVerifier();
    const challenge = await this.generateCodeChallenge(verifier);
    const state = this.generateState();

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: (scopes || this.scopes).join(' '),
      state: state,
      code_challenge_method: 'S256',
      code_challenge: challenge
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  private restoreSession(): void {
    // Try to restore session from localStorage
    const storedToken = localStorage.getItem('spotify_access_token');
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token');
    const storedExpiresAt = localStorage.getItem('spotify_expires_at');
    const storedUserId = localStorage.getItem('spotify_user_id');

    if (storedToken && storedExpiresAt) {
      const expiresAt = parseInt(storedExpiresAt, 10);

      // Check if token is still valid (with 1 minute buffer)
      if (Date.now() < (expiresAt - 60000)) {
        this.accessToken = storedToken;
        this.refreshToken = storedRefreshToken;
        this.expiresAt = expiresAt;
        this.userId = storedUserId;
        console.log('Session restored from localStorage');
      } else {
        // Token expired or about to expire, clear everything
        console.log('Token expired, clearing session');
        this.logout();
      }
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: this.clientId
        })
      });

      if (!response.ok) {
        console.error('Failed to refresh token');
        this.logout();
        return false;
      }

      const data = await response.json();

      // Store new tokens
      this.storeTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token || this.refreshToken,
        expiresIn: data.expires_in
      });

      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return false;
    }
  }

  isSessionValid(): boolean {
    return this.accessToken !== null &&
           this.expiresAt !== null &&
           Date.now() < this.expiresAt;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;