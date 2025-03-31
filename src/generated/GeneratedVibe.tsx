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
  themeOptions,
} from "@/constants/vibePools";
import Modal from "@/components/UI/Modal";
import JournalCard from "@/components/Journal/JournalCard";
import { Vibe } from "@/types/VibeComponent";
import { motion, AnimatePresence } from "framer-motion";

// Background animation components
const FloatingParticles = () => {
  // Create fixed positions that are guaranteed to be spread out
  const fixedPositions = [
    { x: 55, y: 15 },
    { x: 70, y: 10 },
    { x: 85, y: 20 },
    { x: 95, y: 30 },
    { x: 60, y: 35 },
    { x: 80, y: 40 },
    { x: 90, y: 50 },
    { x: 55, y: 55 },
    { x: 75, y: 60 },
    { x: 95, y: 65 },
    { x: 60, y: 70 },
    { x: 80, y: 75 },
    { x: 90, y: 85 },
    { x: 65, y: 90 },
    { x: 75, y: 95 },
  ];

  return (
    <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none z-10">
      {fixedPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${30 + (i % 4) * 20}px`,
            height: `${30 + (i % 4) * 20}px`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Simplified glowing orbs with fixed positions
const GlowingOrbs = () => {
  // Create fixed positions for larger orbs
  const orbPositions = [
    { x: 65, y: 25, size: 150 },
    { x: 85, y: 45, size: 180 },
    { x: 75, y: 75, size: 200 },
  ];

  return (
    <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none z-10">
      {orbPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-radial from-white/15 to-transparent"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${pos.size}px`,
            height: `${pos.size}px`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
};

type Theme = "light" | "dark";

interface Props {
  theme?: Theme;
  showEntry: boolean;
  setShowEntry: React.Dispatch<React.SetStateAction<boolean>>;
}

// Type for the different vibe themes
type VibeTheme = "random" | "aesthetic" | "minimal" | "vibrant" | "nostalgic" | "dreamy" | "glitch" | "cozy";

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function generateVibe(vibeTheme: VibeTheme = "random"): Vibe {
  // For random theme, use the full pools
  if (vibeTheme === "random") {
    return {
      bg: pick(backgrounds),
      font: pick(fonts),
      pet: pick(pets),
      quote: pick(captions),
      audio: pick(audios),
    };
  }
  
  // For specific themes, use the theme-specific pools
  const themePool = themeOptions[vibeTheme as keyof typeof themeOptions];
  
  return {
    bg: pick(themePool.backgrounds),
    font: pick(themePool.fonts),
    pet: pick(themePool.pets),
    quote: pick(themePool.captions),
    audio: pick(audios), // Always use all audio options
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
  const [vibeTheme, setVibeTheme] = useState<VibeTheme>("random");
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  useEffect(() => {
    const handleRemix = () => setRemixCount((prev) => prev + 1);
    window.addEventListener("remix-vibe", handleRemix);
    return () => window.removeEventListener("remix-vibe", handleRemix);
  }, []);

  useEffect(() => {
    // Create a new controller for each effect run
    const controller = new AbortController();
    
    // Set initial states
    const newVibe = generateVibe(vibeTheme);
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
  }, [remixCount, vibeTheme]);

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

  const handleRemix = (theme: VibeTheme) => {
    setVibeTheme(theme);
    setRemixCount(prev => prev + 1);
    setShowThemeOptions(false);
  };

  const themeOptionsList: {type: VibeTheme, emoji: string, label: string}[] = [
    { type: "random", emoji: "🎲", label: "Random" },
    { type: "aesthetic", emoji: "🌸", label: "Aesthetic" },
    { type: "minimal", emoji: "◻️", label: "Minimal" },
    { type: "vibrant", emoji: "🌈", label: "Vibrant" },
    { type: "nostalgic", emoji: "📼", label: "Nostalgic" },
    { type: "dreamy", emoji: "🌙", label: "Dreamy" },
    { type: "glitch", emoji: "👾", label: "Glitch" },
    { type: "cozy", emoji: "🧸", label: "Cozy" },
  ];

  return (
    <div
      className={`w-full h-full ${vibe.bg} ${vibe.font} text-white flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000`}
    >
      {/* Background animations - positioned behind content but visible across the entire screen */}
      <FloatingParticles />
      <GlowingOrbs />
      
      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/30 pointer-events-none z-20" />
      
      <div className="z-40 pointer-events-auto relative flex flex-col items-center">
        <motion.h1 
          className="text-5xl font-bold drop-shadow-xl mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🎲 Random Vibe
        </motion.h1>
        <motion.div 
          className="text-4xl mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {vibe.pet}
        </motion.div>
        <motion.p 
          className="text-lg opacity-80 max-w-md text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {vibe.quote}
        </motion.p>

        <div className="flex gap-4 mb-4">
          <div className="relative">
            <Button
              onClick={() => setShowThemeOptions(!showThemeOptions)}
              theme={theme}
            >
              🔀 Remix Vibe
            </Button>
            
            <AnimatePresence>
              {showThemeOptions && (
                <motion.div 
                  className="absolute top-full left-0 mt-2 bg-black/70 backdrop-blur-md rounded-xl p-3 z-50 border border-white/20 grid grid-cols-2 gap-2 w-[280px]"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {themeOptionsList.map((option, index) => (
                    <motion.button
                      key={option.type}
                      onClick={() => handleRemix(option.type)}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer ${
                        vibeTheme === option.type ? "bg-white/20" : ""
                      }`}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xl">{option.emoji}</span>
                      <span>{option.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
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
