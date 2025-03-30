"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";

export default function StarGarden() {
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
      className={`w-full h-full bg-gradient-to-t from-indigo-900 via-violet-800 to-black text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <h1 className="text-4xl font-bold z-10 animate-pulse mb-2">
        🌠 Star Garden
      </h1>
      <div className="text-3xl mb-2">{pet}</div>
      <p className="text-md max-w-md text-center opacity-80">{caption}</p>

      {/* Falling stars */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[80px] rounded-full bg-gradient-to-b from-white/90 to-white/10 blur-[1px] animate-fallingStar"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              opacity: `${0.5 + Math.random() * 0.5}`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes fallingStar {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            80% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(130vh) translateX(-2vw) scaleX(0.9);
              opacity: 0;
            }
          }

          .animate-fallingStar {
            animation: fallingStar 4s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
