"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import FlickerBar from "@/components/Journal/FlickerBar";
import { pick } from "@/utils/commonMethods";

export default function NeonDream() {
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
      className={`w-full h-full bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-900 text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <h1 className="text-5xl font-bold animate-pulse drop-shadow-glow mb-2">
        🌌 Neon Dream
      </h1>
      <div className="text-3xl mb-2">{pet}</div>
      <p className="text-md text-center max-w-md opacity-80">{caption}</p>

      {/* Vibe FX */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute bottom-0 w-full h-full z-0 bg-no-repeat bg-bottom bg-cover opacity-20"
          style={{ backgroundImage: "url('/assets/grid.png')" }}
        />

        {/* Flicker Bars */}
        {[...Array(20)].map((_, i) => (
          <FlickerBar key={i} />
        ))}

        {/* Keyframes for flicker effect */}
        <style>
          {`
            @keyframes synthBarFlicker {
              0%   { transform: scaleY(0.4); opacity: 0.5; }
              25%  { transform: scaleY(1.2); opacity: 0.9; }
              50%  { transform: scaleY(0.6); opacity: 0.7; }
              75%  { transform: scaleY(1.4); opacity: 1; }
              100% { transform: scaleY(0.4); opacity: 0; }
            }
          `}
        </style>
      </div>
    </div>
  );
}
