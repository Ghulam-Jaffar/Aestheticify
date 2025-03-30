// utils/generateEntry.ts
import { Vibe } from "@/types/VibeComponent";

export async function generateEntry(
  vibe: Vibe,
  signal?: AbortSignal
): Promise<{ entry: string; songQuery: string }> {
  const { pet, font, bg, quote } = vibe;

  const prompt = `Write a short, cozy, poetic journal entry inspired by this vibe:

- Pet: ${pet}
- Font: ${font}
- Background: ${bg}
- Quote: "${quote}"

Keep it dreamlike, surreal, and under 60 words.
Then suggest a fitting song for this vibe in the format:
Song: [song name] by [artist]`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-llama-70b",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.9,
        }),
        signal,
      }
    );

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content ||
      "The dream faded before it was written.";

    const entryMatch = content.match(/Entry:\s*([\s\S]*?)\nSong:/i);
    const songMatch = content.match(/Song:\s*(.+)/i);

    return {
      entry: cleanAIResponse(entryMatch?.[1] ?? content),
      songQuery: songMatch?.[1]?.trim() ?? "chill lofi",
    };
  } catch (err: any) {
    if (err.name !== "AbortError") {
      console.error("Error generating entry:", err);
    }
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
