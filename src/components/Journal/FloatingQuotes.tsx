"use client";

import { useEffect, useState } from "react";

const localQuotes = [
  "Breathe in the static, exhale the glow.",
  "You are a signal in the noise.",
  "Today is wrapped in velvet data.",
  "This is not a dream — it’s a vibe.",
  "Let it flicker. Let it float.",
  "You are synced and seen.",
  "Your calm is loud in here.",
  "Wander soft. Exist bright.",
];

interface FloatingQuote {
  id: number;
  quote: string;
  duration: number;
  position: { top: string; left: string };
}

interface QuoteCardProps {
  quote: string;
  duration: number;
  onDone: () => void;
  theme: "light" | "dark";
}

interface FloatingQuotesProps {
  theme?: "light" | "dark";
}

async function fetchQuote(): Promise<string> {
  try {
    const res = await fetch("https://thequoteshub.com/api/random", {
      headers: {
        "X-Api-Key": "your_api_ninjas_api_key", // Replace this with real key
      },
    });
    const data = await res.json();
    return (
      data?.text || localQuotes[Math.floor(Math.random() * localQuotes.length)]
    );
  } catch {
    return localQuotes[Math.floor(Math.random() * localQuotes.length)];
  }
}

function getRandomPosition() {
  return {
    top: `${Math.random() * 80 + 5}%`,
    left: `${Math.random() * 70 + 10}%`,
  };
}

function QuoteCard({ quote, duration, onDone, theme }: QuoteCardProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <div
      className={`fixed bottom-12 left-1/2 transform -translate-x-1/2 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl max-w-lg text-center text-lg leading-relaxed animate-fade-card z-50 pointer-events-none
        ${
          theme === "light"
            ? "bg-black/10 text-black"
            : "bg-white/10 text-white"
        }`}
      style={{ "--duration": `${duration}s` } as React.CSSProperties}
    >
      <div className="text-3xl mb-2 opacity-40">“</div>
      {quote}
    </div>
  );
}

export default function FloatingQuotes({
  theme = "dark",
}: FloatingQuotesProps) {
  const [bubbleQueue, setBubbleQueue] = useState<FloatingQuote[]>([]);
  const [cardQueue, setCardQueue] = useState<
    { quote: string; duration: number }[]
  >([]);
  const [activeCard, setActiveCard] = useState<{
    quote: string;
    duration: number;
  } | null>(null);

  // Floating bubbles
  useEffect(() => {
    const spawn = async () => {
      const quote = await fetchQuote();
      const duration = Math.min(14, 5 + quote.length / 15);

      if (quote.length < 180) {
        const id = Date.now();
        const position = getRandomPosition();
        setBubbleQueue((prev) => [...prev, { id, quote, duration, position }]);
        setTimeout(() => {
          setBubbleQueue((prev) => prev.filter((b) => b.id !== id));
        }, duration * 1000);
      } else {
        setCardQueue((prev) => [...prev, { quote, duration }]);
      }
    };

    const interval = setInterval(spawn, 6000);
    spawn();
    return () => clearInterval(interval);
  }, []);

  // Card rotation
  useEffect(() => {
    if (!activeCard && cardQueue.length > 0) {
      const next = cardQueue[0];
      setActiveCard(next);
      setCardQueue((prev) => prev.slice(1));
    }

    // Prefetch
    if (cardQueue.length < 2) {
      fetchQuote().then((quote) => {
        if (quote.length >= 180) {
          const duration = Math.min(14, 5 + quote.length / 15);
          setCardQueue((prev) => [...prev, { quote, duration }]);
        }
      });
    }
  }, [cardQueue, activeCard]);

  return (
    <>
      {bubbleQueue.map(({ id, quote, position, duration }) => (
        <div
          key={id}
          className={`absolute text-sm px-4 py-3 rounded-xl backdrop-blur-sm z-30 leading-relaxed animate-fade-float
            ${
              theme === "light"
                ? "bg-black/10 text-black"
                : "bg-white/10 text-white"
            }`}
          style={
            {
              ...position,
              maxWidth: "250px",
              "--duration": `${duration}s`,
            } as React.CSSProperties
          }
        >
          {quote}
        </div>
      ))}

      {activeCard && (
        <QuoteCard
          quote={activeCard.quote}
          duration={activeCard.duration}
          onDone={() => setActiveCard(null)}
          theme={theme}
        />
      )}

      <style>
        {`
          @keyframes fadeFloat {
            0% { opacity: 0; transform: translateY(10px) scale(0.95); }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-10px) scale(1); }
          }

          @keyframes fadeCard {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }

          .animate-fade-float {
            animation: fadeFloat var(--duration, 8s) ease-in-out forwards;
          }

          .animate-fade-card {
            animation: fadeCard var(--duration, 10s) ease-in-out forwards;
          }

          .animate-fade-float:hover,
          .animate-fade-card:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </>
  );
}
