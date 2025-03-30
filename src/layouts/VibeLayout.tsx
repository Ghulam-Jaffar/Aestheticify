"use client";

import { ReactNode, useEffect, useState } from "react";
import AudioToggle from "@/components/Journal/AudioToggle";
import VibeSwitcher from "@/components/Journal/VibeSwitcher";
import FloatingQuotes from "@/components/Journal/FloatingQuotes";
import SynthPet from "@/components/Journal/SynthPet";
import Button from "@/components/UI/Button";
import { VIBES } from "@/vibes";

interface VibeLayoutProps {
  current: string;
  onChange: (key: string) => void;
  audio: string; // ← now required
  theme?: "light" | "dark";
  showEntry: boolean;
  setShowEntry: (val: boolean) => void;
  children: ReactNode;
}

export default function VibeLayout({
  current,
  onChange,
  audio,
  theme = "dark",
  showEntry,
  setShowEntry,
  children,
}: VibeLayoutProps) {
  const [cycleMode, setCycleMode] = useState(false);
  const [showing, setShowing] = useState(children);
  const [visible, setVisible] = useState(true);
  const showAudioToggle = current !== "random";

  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => {
      setShowing(children);
      setVisible(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [current, children]);

  useEffect(() => {
    if (!cycleMode) return;

    const vibeKeys = Object.keys(VIBES);

    const interval = setInterval(() => {
      const index = vibeKeys.indexOf(current);
      const next = vibeKeys[(index + 1) % vibeKeys.length];
      onChange(next);
    }, 20000);

    return () => clearInterval(interval);
  }, [cycleMode, current, onChange]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Fade layer */}
      <div
        className={`transition-opacity duration-500 ease-in-out w-full h-full relative z-30 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {showing}
      </div>

      {/* UI overlay (only if journal not open) */}
      {!showEntry && (
        <div className="absolute inset-0">
          <div className="pointer-events-auto">
            <VibeSwitcher current={current} onChange={onChange} theme={theme} />
            {showAudioToggle && (
              <AudioToggle src={audio} volume={0.5} theme={theme} />
            )}
            <SynthPet theme={theme} />

            {current !== "random" && (
              <div className="absolute bottom-4 left-4 z-50 pointer-events-auto">
                <Button
                  onClick={() => setCycleMode((prev) => !prev)}
                  theme={theme}
                >
                  {cycleMode ? "🔁 Cycling On" : "⏹️ Cycling Off"}
                </Button>
              </div>
            )}
          </div>

          <div className="pointer-events-none">
            <FloatingQuotes theme={theme} />
          </div>
        </div>
      )}
    </div>
  );
}
