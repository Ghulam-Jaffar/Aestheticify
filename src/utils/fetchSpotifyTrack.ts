export async function fetchSpotifyTrack(query: string, signal?: AbortSignal): Promise<string | null> {
    try {
      const res = await fetch(`/api/spotify?q=${encodeURIComponent(query)}`, { signal });
      const data = await res.json();
      return data?.track?.external_urls?.spotify || null;
    } catch (err) {
      console.error("Error fetching Spotify track:", err);
      return null;
    }
  }
  