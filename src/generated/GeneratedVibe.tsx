"use client";

import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import Button from "@/components/UI/Button";
import { generateEntry } from "@/utils/generateEntry";
import { fetchSpotifyTrack } from "@/utils/fetchSpotifyTrack";
import {
  backgrounds,
  fonts,
  pets,
  captions,
  audios,
} from "@/constants/vibePools";
import Modal from "@/components/UI/Modal";
import JournalCard from "@/components/Journal/JournalCard";
import { Vibe } from "@/types/VibeComponent";

type Theme = "light" | "dark";

interface Props {
  theme?: Theme;
  showEntry: boolean;
  setShowEntry: React.Dispatch<React.SetStateAction<boolean>>;
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function generateVibe(): Vibe {
  return {
    bg: pick(backgrounds),
    font: pick(fonts),
    pet: pick(pets),
    quote: pick(captions),
    audio: pick(audios),
  };
}

export default function GeneratedVibe({
  theme = "dark",
  showEntry,
  setShowEntry,
}: Props) {
  const [vibe, setVibe] = useState<Vibe>(generateVibe());
  const [journal, setJournal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const [remixCount, setRemixCount] = useState(0);

  useEffect(() => {
    const handleRemix = () => setRemixCount((prev) => prev + 1);
    window.addEventListener("remix-vibe", handleRemix);
    return () => window.removeEventListener("remix-vibe", handleRemix);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const newVibe = generateVibe();
    setVibe(newVibe);
    setShowEntry(false);
    setJournal(null);
    setLoading(true);

    // Wrap async logic in its own function
    const generate = async () => {
      try {
        // Check if already aborted before starting
        if (signal.aborted) return;
        
        const { entry, songQuery } = await generateEntry(newVibe, signal);
        if (signal.aborted) return;

        const trackUrl = await fetchSpotifyTrack(songQuery, signal);
        if (signal.aborted) return;

        setJournal(entry);
        if (trackUrl) {
          setVibe((prev) => ({ ...prev, trackUrl }));
        }
        setLoading(false);
      } catch (err: any) {
        // Only log errors that aren't related to aborting
        if (!signal.aborted && err.name !== "AbortError") {
          console.error("Error in vibe generation:", err);
        }
        
        // Make sure to reset loading state even on error
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    generate();

    return () => {
      controller.abort("Component unmounted or remixed");
    };
  }, [remixCount]);

  useEffect(() => {
    if (soundRef.current) soundRef.current.unload();
    const sound = new Howl({
      src: [vibe.audio],
      loop: true,
      volume: 0.5,
    });
    sound.play();
    soundRef.current = sound;
    return () => {
      sound.unload(); // cleanly handled now
    };
  }, [vibe.audio]);

  return (
    <div
      className={`w-full h-full ${vibe.bg} ${vibe.font} text-white flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000`}
    >
      <div className="z-40 pointer-events-auto relative flex flex-col items-center">
        <h1 className="text-5xl font-bold drop-shadow-xl mb-4 animate-pulse">
          🎲 Random Vibe
        </h1>
        <div className="text-4xl mb-4">{vibe.pet}</div>
        <p className="text-lg opacity-80 max-w-md text-center mb-6">
          {vibe.quote}
        </p>

        <div className="flex gap-4 mb-4">
          <Button
            onClick={() => setRemixCount((prev) => prev + 1)}
            theme={theme}
          >
            🔀 Remix Vibe
          </Button>
          {journal && (
            <Button onClick={() => setShowEntry((prev) => !prev)} theme={theme}>
              {showEntry ? "📓 Hide Journal" : "📓 Read Journal"}
            </Button>
          )}
        </div>

        {loading && (
          <p className="mt-2 text-sm opacity-50 italic animate-pulse">
            Generating journal entry...
          </p>
        )}
      </div>

      {showEntry && journal && (
        <Modal onClose={() => setShowEntry(false)} custom>
          <JournalCard
            vibe={vibe}
            journal={journal}
            trackUrl={vibe.trackUrl}
            onClose={() => setShowEntry(false)}
            theme={theme}
          />
        </Modal>
      )}
    </div>
  );
}
