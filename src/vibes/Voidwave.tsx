"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";

export default function Voidwave() {
  const [pet, setPet] = useState("");
  const [font, setFont] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    setPet(pick(pets));
    setFont(pick(fonts));
    setCaption(pick(captions));
  }, []);

  return (
    <div
      className={`w-full h-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <h1 className="text-4xl font-bold drop-shadow-glow animate-pulse z-10 mb-2">
        🌒 Voidwave
      </h1>
      <div className="text-3xl mb-2">{pet}</div>
      <p className="text-md text-center max-w-md opacity-70">{caption}</p>

      {/* Neon grid lines */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] w-full bg-gradient-to-r from-purple-500/30 via-fuchsia-500/50 to-purple-500/30 animate-gridWave"
            style={{
              top: `${(i / 30) * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes gridWave {
            0% {
              opacity: 0.1;
              transform: scaleX(1);
            }
            50% {
              opacity: 0.7;
              transform: scaleX(1.05);
            }
            100% {
              opacity: 0.1;
              transform: scaleX(1);
            }
          }

          .animate-gridWave {
            animation: gridWave 5s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
