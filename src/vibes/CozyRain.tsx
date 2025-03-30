"use client";

import React, { useEffect, useState } from "react";
import { fonts, pets, captions } from "@/constants/vibePools";

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface DropStyle {
  left: string;
  top: string;
  animationDelay: string;
}

export default function CozyRain() {
  const [font, setFont] = useState("");
  const [pet, setPet] = useState("");
  const [caption, setCaption] = useState("");
  const [drops, setDrops] = useState<DropStyle[]>([]);

  useEffect(() => {
    setFont(pick(fonts));
    setPet(pick(pets));
    setCaption(pick(captions));

    const rainDrops = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * -100}%`,
      animationDelay: `${Math.random() * 5}s`,
    }));

    setDrops(rainDrops);
  }, []);

  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <h1 className="text-5xl font-bold mb-4">☔ Cozy Rain Vibes</h1>
      <div className="text-3xl mb-2">{pet}</div>
      <p className="text-lg text-gray-300 max-w-md text-center">{caption}</p>

      {/* Floating rain drops */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {drops.map((style, i) => (
          <div
            key={i}
            className="absolute w-1 h-5 bg-white/20 animate-[fall_5s_linear_infinite]"
            style={style}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes fall {
            to {
              transform: translateY(110vh);
            }
          }
        `}
      </style>
    </div>
  );
}
