/**
 * UserSession Model
 * Represents an authenticated Spotify user's session
 */

export interface UserSession {
  accessToken: string;        // Spotify OAuth access token
  expiresAt: number;          // Unix timestamp of token expiry
  refreshToken?: string;      // Optional refresh token (not used in PKCE)
  userId?: string;            // Spotify user ID
  preferences: UserPreferences;
}

export interface UserPreferences {
  lastTheme?: string;         // Last selected theme ID
  lastTimeRange?: TimeRange;  // Last selected time range
  language?: string;          // User language preference
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

/**
 * Creates a new UserSession instance
 */
export function createUserSession(
  accessToken: string,
  expiresIn: number,
  userId?: string,
  refreshToken?: string
): UserSession {
  const expiresAt = Date.now() + (expiresIn * 1000);

  return {
    accessToken,
    expiresAt,
    userId,
    refreshToken,
    preferences: loadPreferences()
  };
}

/**
 * Checks if the session is expired
 */
export function isSessionExpired(session: UserSession): boolean {
  return Date.now() >= session.expiresAt;
}

/**
 * Gets remaining time until expiry in milliseconds
 */
export function getTimeUntilExpiry(session: UserSession): number {
  return Math.max(0, session.expiresAt - Date.now());
}

/**
 * Loads user preferences from localStorage
 */
function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem('userPreferences');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Saves user preferences to localStorage
 */
export function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

/**
 * Clears the user session
 */
export function clearSession(): void {
  // Note: We don't clear preferences on logout
  // Only clear auth-related data (which is in memory only)
}