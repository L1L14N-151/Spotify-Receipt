/**
 * Storage Service
 * Handles local storage for user preferences (not sensitive data)
 */

import { TimeRange } from '../spotify/types';

export interface UserPreferences {
  lastTheme?: string;
  lastTimeRange?: TimeRange;
  language?: string;
}

export interface IStorageService {
  savePreferences(preferences: UserPreferences): void;
  loadPreferences(): UserPreferences | null;
  clearAll(): void;
  isAvailable(): boolean;
}

export class StorageService implements IStorageService {
  private readonly STORAGE_KEY = 'spotify_receipt_preferences';

  savePreferences(preferences: UserPreferences): void {
    if (!this.isAvailable()) {
      console.warn('LocalStorage not available');
      return;
    }

    try {
      // Only save non-sensitive preferences
      const safePreferences: UserPreferences = {
        lastTheme: preferences.lastTheme,
        lastTimeRange: preferences.lastTimeRange,
        language: preferences.language
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(safePreferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  loadPreferences(): UserPreferences | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const preferences = JSON.parse(stored) as UserPreferences;

      // Validate loaded preferences
      if (this.validatePreferences(preferences)) {
        return preferences;
      }

      return null;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  }

  clearAll(): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      // Also clear any legacy storage keys
      this.clearLegacyData();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Additional utility methods

  updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void {
    const current = this.loadPreferences() || {};
    const updated = { ...current, [key]: value };
    this.savePreferences(updated);
  }

  getPreference<K extends keyof UserPreferences>(
    key: K
  ): UserPreferences[K] | undefined {
    const preferences = this.loadPreferences();
    return preferences?.[key];
  }

  private validatePreferences(prefs: any): prefs is UserPreferences {
    if (typeof prefs !== 'object' || prefs === null) {
      return false;
    }

    // Validate theme
    if (prefs.lastTheme !== undefined && typeof prefs.lastTheme !== 'string') {
      return false;
    }

    // Validate time range
    const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
    if (prefs.lastTimeRange !== undefined && !validTimeRanges.includes(prefs.lastTimeRange)) {
      return false;
    }

    // Validate language
    if (prefs.language !== undefined && typeof prefs.language !== 'string') {
      return false;
    }

    return true;
  }

  private clearLegacyData(): void {
    // Clear any old storage keys that might exist
    const legacyKeys = [
      'spotify_access_token', // Should never be stored
      'spotify_refresh_token', // Should never be stored
      'spotify_user_id',
      'receipt_history'
    ];

    legacyKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore errors for legacy keys
      }
    });
  }

  // Session storage methods for temporary data

  saveSessionData(key: string, data: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save session data:', error);
    }
  }

  loadSessionData<T>(key: string): T | null {
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load session data:', error);
      return null;
    }
  }

  clearSessionData(key?: string): void {
    try {
      if (key) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;