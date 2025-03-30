"use client";

import React, { useEffect, useState } from "react";

const emojis = ["🐱", "🐰", "🦊", "🐸", "🐥", "🧸", "👾", "🌸"];
const quotes = [
  "Stay curious.",
  "Vibe higher.",
  "You are seen.",
  "Glitch in peace.",
  "Code the calm.",
  "Be soft and strange.",
];

interface Props {
  theme?: "light" | "dark";
}

interface Position {
  x: number;
  y: number;
}

export default function SynthPet({ theme = "dark" }: Props) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [target, setTarget] = useState<Position>({ x: 0, y: 0 });
  const [emoji, setEmoji] = useState<string>("🐱");
  const [bubble, setBubble] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Init safely after client mount
  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight - 80;
    setPosition({ x: centerX, y: centerY });
    setTarget({ x: centerX, y: centerY });
    setReady(true);
  }, []);

  // Smooth movement
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: prev.x + (target.x - prev.x) * 0.05,
        y: prev.y + (target.y - prev.y) * 0.05,
      }));
    }, 20);
    return () => clearInterval(interval);
  }, [target, ready]);

  // Mouse follow & idle motion
  useEffect(() => {
    if (!ready) return;
    let lastMove = Date.now();

    const handleMove = (e: MouseEvent) => {
      lastMove = Date.now();
      setTarget({ x: e.clientX - 32, y: e.clientY - 32 });
    };

    const idleInterval = setInterval(() => {
      if (Date.now() - lastMove > 3000) {
        setTarget({
          x: window.innerWidth / 2 + Math.random() * 200 - 100,
          y: window.innerHeight - 100 + Math.random() * 40 - 20,
        });
      }
    }, 2000);

    window.addEventListener("mousemove", handleMove);
    return () => {
      clearInterval(idleInterval);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [ready]);

  // Change emoji on theme change
  useEffect(() => {
    const random = emojis[Math.floor(Math.random() * emojis.length)];
    setEmoji(random);
  }, [theme]);

  const handleClick = () => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setBubble(quote);
    setTimeout(() => setBubble(null), 3000);
  };

  if (!ready) return null;

  return (
    <>
      {bubble && (
        <div
          className="fixed text-sm px-3 py-2 rounded-xl bg-white/20 text-white backdrop-blur pointer-events-none z-50"
          style={{
            left: position.x - 60,
            top: position.y - 60,
          }}
        >
          {bubble}
        </div>
      )}

      <div
        className="fixed z-50 transition-transform duration-300"
        onClick={handleClick}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center animate-float glow transition-all duration-500 ease-in-out cursor-pointer hover:scale-110 
            ${
              theme === "light"
                ? "bg-black/10 text-black"
                : "bg-white/10 text-white"
            }`}
          style={{
            boxShadow:
              theme === "light"
                ? "0 0 15px rgba(0,0,0,0.2)"
                : "0 0 15px rgba(255,255,255,0.15)",
          }}
        >
          {emoji}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
