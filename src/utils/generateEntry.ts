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

export function cleanAIResponse(raw: string): string {
  if (!raw) return "";

  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  cleaned = cleaned.replace(/> \*\*Journal Entry:.*?\*\*/gi, "").trim();
  cleaned = cleaned.replace(/^>+/gm, "").trim();
  cleaned = cleaned.replace(/\*\*/g, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned;
}
