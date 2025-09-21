/**
 * Spotify Data Service
 * Handles fetching data from Spotify Web API
 */

import { ISpotifyDataService, SpotifyTrack, UserProfile, TimeRange } from './types';
import authService from '../auth/AuthService';

export class SpotifyDataService implements ISpotifyDataService {
  private readonly baseUrl = 'https://api.spotify.com/v1';

  async getTopTracks(timeRange: TimeRange, limit: number = 20): Promise<SpotifyTrack[]> {
    const token = authService.getAccessToken();
    console.log('getTopTracks - Token exists:', !!token);

    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const url = `${this.baseUrl}/me/top/tracks?time_range=${timeRange}&limit=${limit}`;
      console.log('Fetching from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to fetch top tracks: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Data received:', {
        hasItems: !!data.items,
        itemCount: data.items?.length || 0,
        total: data.total
      });

      return this.transformTracks(data.items || []);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const token = authService.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        displayName: data.display_name || data.id,
        email: data.email,
        country: data.country,
        product: data.product as 'free' | 'premium',
        imageUrl: data.images?.[0]?.url || null
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  calculateTotalListeningTime(tracks: SpotifyTrack[]): number {
    return tracks.reduce((total, track) => {
      return total + (track.durationMs * track.playCount);
    }, 0);
  }

  private transformTracks(spotifyTracks: any[]): SpotifyTrack[] {
    return spotifyTracks.map((track, index) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => ({
        name: artist.name
      })),
      album: track.album ? {
        name: track.album.name,
        images: track.album.images || []
      } : undefined,
      durationMs: track.duration_ms,
      playCount: this.estimatePlayCount(track.popularity, index + 1),
      albumArtUrl: track.album?.images?.[0]?.url
    }));
  }

  private estimatePlayCount(popularity: number, rank: number): number {
    // Estimate play count based on popularity and rank
    // Higher rank (lower number) = more plays
    // Popularity 0-100 scale

    const rankMultiplier = Math.max(1, 26 - rank); // 25 for rank 1, 1 for rank 25
    const popularityFactor = Math.max(1, popularity / 2); // 0-50 range

    // Base play count with some randomness
    const baseCount = Math.floor(popularityFactor * rankMultiplier);
    const variance = Math.floor(Math.random() * 20) - 10; // +/- 10 plays

    return Math.max(1, baseCount + variance);
  }
}

// Export singleton instance
const spotifyDataService = new SpotifyDataService();
export default spotifyDataService;