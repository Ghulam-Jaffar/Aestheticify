"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";

export default function DreamcoreCloud() {
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
      className={`w-full h-full bg-gradient-to-br from-[#fceaff] via-[#e8d5ff] to-[#d6ecff] text-purple-800 flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <h1 className="text-4xl font-bold drop-shadow-lg animate-pulse z-10 mb-2">
        ☁️ Dreamcore Cloud
      </h1>
      <div className="text-3xl mb-2">{pet}</div>
      <p className="text-md text-center max-w-md opacity-70">{caption}</p>

      {/* Floating drifting clouds */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[260px] h-[130px] rounded-full animate-cloudDrift z-20"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 100}vw`,
              background: `radial-gradient(circle at center, rgba(80, 80, 120, 0.9), rgba(255,255,255,0))`,
              filter: "blur(60px)",
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${40 + Math.random() * 30}s`,
              opacity: `${0.6 + Math.random() * 0.2}`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes cloudDrift {
            0% {
              transform: translateX(0) translateY(0);
              opacity: 0.6;
            }
            50% {
              transform: translateX(-50vw) translateY(-4px);
              opacity: 0.75;
            }
            100% {
              transform: translateX(-200vw) translateY(0);
              opacity: 0.6;
            }
          }

          .animate-cloudDrift {
            animation: cloudDrift 60s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
