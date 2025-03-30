"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";

export default function PixelChill() {
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
      className={`w-full h-full bg-[#1d1f2f] text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <h1 className="text-4xl font-bold animate-pulse z-10 mb-2">
        🕹️ Pixel Chill
      </h1>
      <div className="text-3xl mb-2">{pet}</div>
      <p className="text-md text-center max-w-md opacity-70">{caption}</p>

      {/* Pixel birds or blocks */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[4px] h-[4px] bg-[#9ae1ff] shadow-[0_0_6px_#9ae1ff] opacity-80 animate-pixelFly"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes pixelFly {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.9;
            }
            50% {
              transform: translateY(-60vh) scale(1.2);
              opacity: 1;
            }
            100% {
              transform: translateY(-120vh) scale(1);
              opacity: 0;
            }
          }

          .animate-pixelFly {
            animation: pixelFly 6s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
