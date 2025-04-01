// utils/fetchQuote.ts

// Local quotes as fallback
const localQuotes = [
  "Breathe in the static, exhale the glow.",
  "You are a signal in the noise.",
  "Today is wrapped in velvet data.",
  "This is not a dream — it's a vibe.",
  "Let it flicker. Let it float.",
  "You are synced and seen.",
  "Your calm is loud in here.",
  "Wander soft. Exist bright.",
];

/**
 * Fetches a random quote from an external API
 * Falls back to local quotes if the API request fails
 * @returns A promise that resolves to a quote string
 */
export async function fetchQuote(): Promise<string> {
  try {
    const res = await fetch("https://thequoteshub.com/api/random", {
      headers: {
        "X-Api-Key": "your_api_ninjas_api_key", // Replace this with real key
      },
    });
    const data = await res.json();
    return (
      data?.text || getLocalQuote()
    );
  } catch {
    return getLocalQuote();
  }
}

/**
 * Returns a random quote from the local collection
 * @returns A random quote string
 */
export function getLocalQuote(): string {
  return localQuotes[Math.floor(Math.random() * localQuotes.length)];
}

/**
 * Returns the collection of local quotes
 * @returns Array of quote strings
 */
export function getLocalQuotes(): string[] {
  return [...localQuotes];
}
