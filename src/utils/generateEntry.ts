// utils/generateEntry.ts
import { Vibe } from "@/types/VibeComponent";

export async function generateEntry(
  vibe: Vibe,
  signal?: AbortSignal
): Promise<{ entry: string; songQuery: string }> {
  try {
    const response = await fetch("/api/generate-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vibe }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate entry");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating entry:", error);
    return {
      entry: "The dream faded before it was written.",
      songQuery: "chill lofi",
    };
  }
}

export function cleanAIResponse(rawText: string): string {
  if (!rawText) return "";

  // Extract journal entry from the response
  const entryStartMarker = "**Journal Entry:**";

  const startIndex = rawText.indexOf(entryStartMarker);
  if (startIndex === -1) {
    // If marker not found, assume the whole text is the entry
    // or maybe it's the default error message.
    return rawText.trim();
  }

  // Extract text after the marker
  let entryText = rawText.substring(startIndex + entryStartMarker.length);

  // Clean up leading/trailing whitespace and markdown formatting
  // (Handles potential italics or bold around the entry itself)
  return entryText.trim().replace(/^[*_\s]+|[*_\s]+$/g, "").trim();
}
