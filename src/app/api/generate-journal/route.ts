import { NextRequest, NextResponse } from "next/server";
import { cleanAIResponse } from "@/utils/generateJournal";

// Song recommendations based on different vibes
const songRecommendations = {
  // Aesthetic vibes
  "🌸": ["Bloom by Troye Sivan", "Pastel by Moe Shop", "Strawberry Blond by Mitski", "Passionfruit by Drake"],
  "🦢": ["Swan Lake by Tchaikovsky", "Featherweight by Fleet Foxes", "White Winter Hymnal by Fleet Foxes"],
  "🕊️": ["Free Bird by Lynyrd Skynyrd", "Weightless by Marconi Union", "Fly Me to the Moon by Frank Sinatra"],
  "🪷": ["Lotus Flower by Radiohead", "Lotus Eater by Foster the People", "Water Lily by Liz Phair"],
  "🌷": ["Sunflower by Post Malone", "Flower by Moby", "Wildflowers by Tom Petty"],
  "🦋": ["Butterfly by Crazy Town", "Butterfly by BTS", "Blue Butterfly by Doja Cat"],
  "🦩": ["Flamingo by Kero Kero Bonito", "Pink + White by Frank Ocean", "Pink Pony Club by Chappell Roan"],
  
  // Minimal vibes
  "◻️": ["Intro by The xx", "Midnight City by M83", "Teardrop by Massive Attack"],
  "◼️": ["Black by Pearl Jam", "Back to Black by Amy Winehouse", "Paint it Black by The Rolling Stones"],
  "⚪": ["White Room by Cream", "White Ferrari by Frank Ocean", "White Winter Hymnal by Fleet Foxes"],
  "⚫": ["Black Hole Sun by Soundgarden", "Black by Pearl Jam", "Blackbird by The Beatles"],
  "🔲": ["Square One by Coldplay", "Squares by The Beta Band", "Four Corners by Staind"],
  "🔳": ["Polaroid by Imagine Dragons", "Frames by Katie Melua", "Picture Frame by King Krule"],
  
  // Vibrant vibes
  "🌈": ["Somewhere Over the Rainbow by Israel Kamakawiwoʻole", "Colors by Black Pumas", "Rainbow by Kacey Musgraves"],
  "✨": ["Starlight by Muse", "Stardust by Nat King Cole", "Shooting Stars by Bag Raiders"],
  "💫": ["Stargazing by Travis Scott", "Space Song by Beach House", "Cosmic Girl by Jamiroquai"],
  "⭐": ["Starboy by The Weeknd", "Counting Stars by OneRepublic", "Yellow Stars by Dizzy Gillespie"],
  "🔆": ["Here Comes the Sun by The Beatles", "Walking on Sunshine by Katrina & The Waves", "Blinding Lights by The Weeknd"],
  "🎨": ["Colors by Halsey", "Art Deco by Lana Del Rey", "The Painter by Cody Jinks"],
  
  // Nostalgic vibes
  "📻": ["Video Killed the Radio Star by The Buggles", "Radio Ga Ga by Queen", "Radio by Lana Del Rey"],
  "📺": ["TV by Billie Eilish", "Television Rules the Nation by Daft Punk", "Kill Your Television by Ned's Atomic Dustbin"],
  "🎮": ["Video Games by Lana Del Rey", "Play the Game by Queen", "The Game by Motorhead"],
  "💾": ["Digital Love by Daft Punk", "Technologic by Daft Punk", "Computer Love by Kraftwerk"],
  "📼": ["Videotape by Radiohead", "Video Tape by LCD Soundsystem", "Tape Song by The Kills"],
  "🕹️": ["Play the Game by Queen", "Pac-Man by Gorillaz", "Game Over by Falling In Reverse"],
  
  // Dreamy vibes
  "🌙": ["Moon River by Frank Ocean", "Moonlight by XXXTentacion", "Moonage Daydream by David Bowie"],
  "☁️": ["Both Sides Now by Joni Mitchell", "Cloud 9 by Beach Bunny", "Cloudbusting by Kate Bush"],
  "🌌": ["Space Oddity by David Bowie", "Andromeda by Gorillaz", "Supernova by Ansel Elgort"],
  "🔮": ["Crystal Ball by Keane", "Future Nostalgia by Dua Lipa", "Visions by Grimes"],
  "🌠": ["Shooting Stars by Bag Raiders", "Starlight by Muse", "Stellar by Incubus"],
  
  // Glitch vibes
  "👾": ["Digital Love by Daft Punk", "Glitch by Martin Garrix", "Technologic by Daft Punk"],
  "🤖": ["Robot Rock by Daft Punk", "Mr. Roboto by Styx", "Paranoid Android by Radiohead"],
  "💻": ["Computer Love by Kraftwerk", "Computer Blue by Prince", "Digital by Joy Division"],
  "🖥️": ["Digital by Joy Division", "Computer World by Kraftwerk", "Digital Love by Daft Punk"],
  "📱": ["Hotline Bling by Drake", "Phone Down by Erykah Badu", "Telephone by Lady Gaga"],
  "🎛️": ["Da Funk by Daft Punk", "Around the World by Daft Punk", "Harder Better Faster Stronger by Daft Punk"],
  
  // Cozy vibes
  "🧸": ["Teddy Bear by STAYC", "Teddy Picker by Arctic Monkeys", "Teddy Swims by Bed on Fire"],
  "🧶": ["Sweater Weather by The Neighbourhood", "Cardigan by Taylor Swift", "Wool by Ambient Music Therapy"],
  "🧣": ["All Too Well by Taylor Swift", "Red Scarf by Ginger Root", "Wrapped Around Your Finger by The Police"],
  "🍵": ["Cup of Tea by Kacey Musgraves", "Coffee by Beabadoobee", "Tea for Two by Doris Day"],
  "🕯️": ["Candle in the Wind by Elton John", "Light My Fire by The Doors", "Burn by Ellie Goulding"],
  "🧦": ["Red Socks Pugie by Foals", "Socks by Why Don't We", "Blue Socks by Ace Wilder"],
  
  // Default options for pets not in the list
  "default": ["Midnight City by M83", "Dreams by Fleetwood Mac", "Blinding Lights by The Weeknd", 
              "Redbone by Childish Gambino", "Sweater Weather by The Neighbourhood", 
              "Lofi Beats to Study/Relax to", "Space Song by Beach House", 
              "Resonance by HOME", "Tame Impala by The Less I Know The Better"]
};

// Get background category
function getBackgroundCategory(bg: string): string {
  if (bg.includes("pink") || bg.includes("purple") || bg.includes("rose") || bg.includes("fuchsia")) {
    return "aesthetic";
  } else if (bg.includes("[#") || bg.includes("gray") || bg.includes("black")) {
    return "minimal";
  } else if (bg.includes("green") || bg.includes("blue") || bg.includes("yellow") || bg.includes("teal")) {
    return "vibrant";
  } else if (bg.includes("amber") || bg.includes("orange")) {
    return "nostalgic";
  } else if (bg.includes("indigo") || bg.includes("slate")) {
    return "dreamy";
  } else {
    return "default";
  }
}

// Get quote category
function getQuoteCategory(quote: string): string {
  const lowerQuote = quote.toLowerCase();
  
  if (lowerQuote.includes("bloom") || lowerQuote.includes("delicate") || lowerQuote.includes("soft")) {
    return "aesthetic";
  } else if (lowerQuote.includes("less") || lowerQuote.includes("simple") || lowerQuote.includes("silence")) {
    return "minimal";
  } else if (lowerQuote.includes("color") || lowerQuote.includes("vibrant") || lowerQuote.includes("joy")) {
    return "vibrant";
  } else if (lowerQuote.includes("remember") || lowerQuote.includes("memories") || lowerQuote.includes("old")) {
    return "nostalgic";
  } else if (lowerQuote.includes("dream") || lowerQuote.includes("star") || lowerQuote.includes("cosmos")) {
    return "dreamy";
  } else if (lowerQuote.includes("system") || lowerQuote.includes("digital") || lowerQuote.includes("pixel")) {
    return "glitch";
  } else if (lowerQuote.includes("comfort") || lowerQuote.includes("warm") || lowerQuote.includes("home")) {
    return "cozy";
  } else {
    return "default";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { vibe } = await request.json();
    const { pet, font, bg, quote } = vibe;

    // Generate song recommendation based on the vibe
    let songQuery = "lofi chill beats"; // Default fallback
    
    // Try to get a song recommendation based on the pet emoji
    if (pet && songRecommendations[pet as keyof typeof songRecommendations]) {
      const songs = songRecommendations[pet as keyof typeof songRecommendations];
      songQuery = songs[Math.floor(Math.random() * songs.length)];
    } else {
      // If pet not found in our list, use background or quote to determine category
      const bgCategory = getBackgroundCategory(bg);
      const quoteCategory = getQuoteCategory(quote);
      
      // Pick a random song from the default category
      const defaultSongs = songRecommendations.default;
      songQuery = defaultSongs[Math.floor(Math.random() * defaultSongs.length)];
    }

    // Generate the journal entry
    const entryPrompt = `Create a creative journal entry with a title based on this vibe:

- Pet: ${pet}
- Font: ${font}
- Background: ${bg}
- Quote: "${quote}"

First, generate a short, evocative title that captures the essence of the journal entry.
Then, write a dreamlike, surreal, and poetic journal entry under 60 words.

Format your response exactly like this:
**Title:** [Your generated title]
**Journal Entry:** [Your journal entry text]`;

    const entryResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-llama-70b",
          messages: [{ role: "user", content: entryPrompt }],
          temperature: 0.9,
        }),
      }
    );

    if (!entryResponse.ok) {
      return NextResponse.json(
        { error: "Failed to generate journal" },
        { status: entryResponse.status }
      );
    }

    const entryData = await entryResponse.json();
    const content = entryData?.choices?.[0]?.message?.content || 
      "**Title:** Untitled Dream\n**Journal Entry:** The dream faded before it was written.";

    // Parse title and journal entry from the response
    let title = "Untitled Dream";
    let entry = "";
    
    const titleMatch = content.match(/\*\*Title:\*\*\s*(.*?)(?=\n\*\*Journal Entry:|$)/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }
    
    const entryMatch = content.match(/\*\*Journal Entry:\*\*\s*([\s\S]*?)$/);
    if (entryMatch && entryMatch[1]) {
      entry = entryMatch[1].trim();
    } else {
      // Fallback to cleaning the whole response if we can't extract the entry
      entry = cleanAIResponse(content);
    }

    // Return the title, entry and song query
    return NextResponse.json({
      title,
      entry,
      songQuery,
    });
  } catch (error) {
    console.error("Error generating journal:", error);
    return NextResponse.json(
      { error: "Failed to generate journal" },
      { status: 500 }
    );
  }
}
