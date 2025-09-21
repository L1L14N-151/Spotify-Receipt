/**
 * Track Model
 * Represents a Spotify track with listening statistics
 */

export interface Track {
  id: string;               // Spotify track ID
  title: string;            // Track name
  artist: string;           // Artist name(s) joined
  artists: string[];        // Array of artist names
  playCount: number;        // Number of plays (estimated)
  duration: number;         // Track duration in milliseconds
  albumArt?: string;        // Album cover URL (optional)
  rank: number;             // Position in top tracks (1-based)
}

/**
 * Creates a Track from Spotify API response
 */
export function createTrackFromSpotify(
  spotifyTrack: any,
  rank: number,
  popularity?: number
): Track {
  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists.map((a: any) => a.name).join(', '),
    artists: spotifyTrack.artists.map((a: any) => a.name),
    playCount: estimatePlayCount(popularity || spotifyTrack.popularity),
    duration: spotifyTrack.duration_ms,
    albumArt: spotifyTrack.album?.images?.[0]?.url,
    rank
  };
}

/**
 * Estimates play count from Spotify popularity score (0-100)
 * This is a rough approximation since Spotify doesn't provide exact play counts
 */
function estimatePlayCount(popularity: number): number {
  // Map popularity (0-100) to estimated play count
  // Assuming:
  // 100 popularity ≈ 500 plays
  // 50 popularity ≈ 100 plays
  // 0 popularity ≈ 1 play

  if (popularity >= 90) return Math.floor(300 + (popularity - 90) * 20);
  if (popularity >= 70) return Math.floor(150 + (popularity - 70) * 7.5);
  if (popularity >= 50) return Math.floor(75 + (popularity - 50) * 3.75);
  if (popularity >= 30) return Math.floor(30 + (popularity - 30) * 2.25);
  if (popularity >= 10) return Math.floor(10 + (popularity - 10));
  return Math.max(1, Math.floor(popularity));
}

/**
 * Validates a track object
 */
export function validateTrack(track: any): track is Track {
  return (
    typeof track.id === 'string' &&
    typeof track.title === 'string' &&
    typeof track.artist === 'string' &&
    Array.isArray(track.artists) &&
    typeof track.playCount === 'number' &&
    typeof track.duration === 'number' &&
    typeof track.rank === 'number' &&
    track.rank >= 1 &&
    track.rank <= 50
  );
}

/**
 * Truncates long track title for display
 */
export function truncateTitle(title: string, maxLength: number = 40): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
}

/**
 * Formats duration from milliseconds to human-readable format
 */
export function formatDuration(durationMs: number): string {
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Calculates total listening time for a track
 */
export function calculateTrackListeningTime(track: Track): number {
  return track.duration * track.playCount;
}

/**
 * Gets display name for receipt (truncated if needed)
 */
export function getTrackDisplayName(track: Track, maxLength: number = 40): string {
  const combined = `${truncateTitle(track.title, 25)} - ${track.artist}`;
  return truncateTitle(combined, maxLength);
}