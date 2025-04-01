// utils/fetchTrackMetadata.ts

/**
 * Interface for Spotify track metadata
 */
export interface SpotifyTrackInfo {
  name: string;
  artist: string;
  albumArt?: string;
}

/**
 * Extracts the Spotify track ID from a Spotify URL
 * @param trackUrl The Spotify track URL
 * @returns The track ID or undefined if not found
 */
export function extractTrackId(trackUrl?: string): string | undefined {
  if (!trackUrl) return undefined;
  
  // Handle different Spotify URL formats
  const match = trackUrl.match(/track\/([a-zA-Z0-9]+)/);
  return match?.[1];
}

/**
 * Fetches metadata for a Spotify track
 * @param trackUrl The Spotify track URL
 * @returns Promise resolving to track metadata or undefined if not found
 */
export async function fetchTrackMetadata(trackUrl?: string): Promise<SpotifyTrackInfo | undefined> {
  try {
    const trackId = extractTrackId(trackUrl);
    if (!trackId) return undefined;
    
    // Fetch track details from our API
    const response = await fetch(`/api/spotify/track?id=${trackId}`);
    const data = await response.json();

    if (data.track) {
      return {
        name: data.track.name,
        artist: data.track.artists?.[0]?.name || "Unknown Artist",
        albumArt: data.track.album?.images?.[0]?.url,
      };
    }
  } catch (error) {
    console.error("Error fetching track info:", error);
  }
  return undefined;
}
