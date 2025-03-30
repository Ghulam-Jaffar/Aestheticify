import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { vibe } = await request.json();
    const { pet, font, bg, quote } = vibe;

    const prompt = `Write a short, cozy, poetic journal entry inspired by this vibe:

- Pet: ${pet}
- Font: ${font}
- Background: ${bg}
- Quote: "${quote}"

Keep it dreamlike, surreal, and under 60 words.
Start the response directly with "**Journal Entry:**" followed by the entry text. Do not include any other text before or after the entry.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-llama-70b",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.9,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to generate entry" },
        { status: response.status }
      );
    }

    const content =
      data?.choices?.[0]?.message?.content ||
      "The dream faded before it was written.";

    // Return the cleaned content directly, frontend will handle markdown
    return NextResponse.json({
      entry: cleanAIResponse(content),
    });
  } catch (error) {
    console.error("Error generating entry:", error);
    return NextResponse.json(
      { error: "Failed to generate entry" },
      { status: 500 }
    );
  }
}

function cleanAIResponse(text: string): string {
  return text
    .trim()
    .replace(/^["\s]+|["\s]+$/g, "") // Remove quotes and extra spaces
    .replace(/\\n/g, "\n"); // Replace literal \n with newlines
}
