export async function fetchSpotifyTrack(query: string, signal?: AbortSignal): Promise<string | null> {
    try {
      // Check if already aborted before starting
      if (signal?.aborted) {
        return null;
      }
      
      const res = await fetch(`/api/spotify?q=${encodeURIComponent(query)}`, { signal });
      const data = await res.json();
      return data?.track?.external_urls?.spotify || null;
    } catch (err: any) {
      // Don't log AbortError as an error since it's expected behavior
      if (err.name === "AbortError" || err.message === "Request was aborted") {
        return null;
      }
      
      console.error("Error fetching Spotify track:", err);
      return null;
    }
  }