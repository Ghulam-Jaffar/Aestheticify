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
    // Create a new controller for each effect run
    const controller = new AbortController();
    
    // Set initial states
    const newVibe = generateVibe();
    setVibe(newVibe);
    setShowEntry(false);
    setJournal(null);
    setLoading(true);

    // Define a flag to track component mount state
    let isMounted = true;

    // Wrap async logic in its own function
    const generate = async () => {
      try {
        // Only proceed if still mounted
        if (!isMounted) return;
        
        // Use try/catch for each async operation
        let result;
        try {
          result = await generateEntry(newVibe, controller.signal);
        } catch (e) {
          // Silently fail if not mounted
          if (!isMounted) return;
          throw e;
        }
        
        // Check mount state again
        if (!isMounted) return;

        // Try to fetch track
        let trackUrl;
        try {
          trackUrl = await fetchSpotifyTrack(result.songQuery, controller.signal);
        } catch (e) {
          // Silently fail if not mounted
          if (!isMounted) return;
          // Continue without track if there's an error
        }

        // Final mount check before updating state
        if (!isMounted) return;
        
        setJournal(result.entry);
        if (trackUrl) {
          setVibe((prev) => ({ ...prev, trackUrl }));
        }
        setLoading(false);
      } catch (err) {
        // Only update state and log if still mounted
        if (isMounted) {
          console.error("Error in vibe generation:", err);
          setLoading(false);
        }
      }
    };

    // Start the generation process
    generate();

    // Cleanup function
    return () => {
      isMounted = false;
      
      // Use a try/catch to prevent any errors during abort
      try {
        controller.abort();
      } catch (e) {
        // Silently ignore any abort errors
      }
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
