export interface ISpotifyDataService {
  getTopTracks(timeRange: TimeRange, limit?: number): Promise<SpotifyTrack[]>;
  getUserProfile(): Promise<UserProfile | null>;
  calculateTotalListeningTime(tracks: SpotifyTrack[]): number;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album?: {
    name: string;
    images: Array<{ url: string; height?: number; width?: number }>;
  };
  durationMs: number;
  playCount: number;
  albumArtUrl?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  country?: string;
  product?: 'free' | 'premium';
  imageUrl?: string | null;
}