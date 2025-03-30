"use client";

import { useState, useEffect } from "react";
import { fonts, pets, captions } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";

export default function DigitalSunrise() {
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
      className={`w-full h-full bg-gradient-to-b from-orange-200 via-pink-300 to-purple-500 text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <h1 className="text-4xl font-bold animate-pulse z-10 mb-2">
        🌅 Digital Sunrise
      </h1>
      <div className="text-3xl mb-2">{pet}</div>
      <p className="text-md max-w-md text-center opacity-80">{caption}</p>

      {/* Rising glow rings */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-end justify-center">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-sunriseRing"
            style={{
              width: `${120 + i * 100}px`,
              height: `${120 + i * 100}px`,
              bottom: "0px",
              border: `2px solid rgba(255, 255, 255, 0.2)`,
              boxShadow: `0 0 40px rgba(255, 255, 255, 0.15)`,
              filter: "blur(1px)",
              animationDelay: `${i * 1.8}s`,
              animationDuration: `${8 + i * 1}s`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes sunriseRing {
            0% {
              transform: scale(0.85);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.9;
            }
            100% {
              transform: scale(0.85);
              opacity: 0.3;
            }
          }

          .animate-sunriseRing {
            animation: sunriseRing 10s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
