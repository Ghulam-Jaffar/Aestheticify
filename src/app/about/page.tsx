"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AboutPage() {
  const router = useRouter();
  const [currentVibe, setCurrentVibe] = useState(0);

  const vibeDescriptions = [
    {
      name: "Cozy Rain",
      emoji: "☔",
      description:
        "Immerse yourself in the gentle patter of raindrops against your window while staying warm and cozy inside.",
    },
    {
      name: "Neon Dream",
      emoji: "🌌",
      description:
        "Dive into a cyberpunk world of neon lights and retro-futuristic aesthetics.",
    },
    {
      name: "Dreamcore Cloud",
      emoji: "☁️",
      description:
        "Float away on surreal clouds of nostalgic dreamscapes and liminal spaces.",
    },
    {
      name: "Star Garden",
      emoji: "🌠",
      description:
        "Wander through a cosmic garden where stars bloom and galaxies unfold.",
    },
    {
      name: "Pixel Chill",
      emoji: "🕹️",
      description:
        "Relax with retro pixel art vibes that transport you to simpler digital times.",
    },
    {
      name: "Voidwave",
      emoji: "🌊",
      description:
        "Ride the waves of the digital void, where darkness meets beauty.",
    },
    {
      name: "Digital Sunrise",
      emoji: "🌅",
      description:
        "Experience the dawn of a new digital day with warm, glowing aesthetics.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVibe((prev) => (prev + 1) % vibeDescriptions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black to-purple-900 text-white flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
      >
        <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Welcome to Aestheticify <span className="text-purple-300">✨</span>
        </h1>

        <div className="text-center mb-10">
          <p className="text-xl mb-4">
            Your personal portal to infinite aesthetic vibes
          </p>
          <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm">
            Version 1.0 • Launched 2025
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">
              🌈 What is Aestheticify?
            </h2>
            <p className="mb-3">
              Aestheticify is your digital escape into curated visual and audio
              experiences. We call them "vibes" - immersive digital spaces where
              you can relax, journal, find inspiration, or simply exist in a
              different aesthetic reality.
            </p>
            <p>
              Whether you're looking for a cozy rainy day atmosphere, a
              neon-drenched cyberpunk cityscape, or a dreamy cloud paradise,
              Aestheticify transports you there with just one click.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-pink-300">
              ✨ Features
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-xl">🎨</span>
                <span>
                  7+ unique aesthetic environments with custom visuals and audio
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">🎵</span>
                <span>Immersive audio experiences tailored to each vibe</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">📝</span>
                <span>
                  Journal your thoughts in each vibe and save them to your
                  collection
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">🔄</span>
                <span>AI-generated random vibes for endless exploration</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xl">🌐</span>
                <span>Share your favorite vibes with friends</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">
            🌟 Explore Our Vibes
          </h2>

          <motion.div
            key={currentVibe}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center mb-3">
              <span className="text-4xl mr-3">
                {vibeDescriptions[currentVibe].emoji}
              </span>
              <h3 className="text-2xl font-bold">
                {vibeDescriptions[currentVibe].name}
              </h3>
            </div>
            <p className="text-gray-300">
              {vibeDescriptions[currentVibe].description}
            </p>
          </motion.div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center text-green-300">
            🧠 How It Works
          </h2>
          <p className="text-center mb-6">
            Aestheticify combines visual design, audio engineering, and web
            technology to create immersive digital environments that engage
            multiple senses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-3xl mb-2">👁️</div>
              <h3 className="font-bold mb-1">Visual</h3>
              <p className="text-sm text-gray-400">
                Carefully crafted visuals and animations
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-3xl mb-2">👂</div>
              <h3 className="font-bold mb-1">Audio</h3>
              <p className="text-sm text-gray-400">
                Custom soundscapes for each environment
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-3xl mb-2">💭</div>
              <h3 className="font-bold mb-1">Interaction</h3>
              <p className="text-sm text-gray-400">
                Journal, save, and share your experiences
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-yellow-300">
            Ready to find your vibe?
          </h2>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Start Vibing Now ✨
          </button>

          <p className="mt-6 text-sm text-gray-400">
            Created with 💜 by the Aestheticify team
          </p>
        </div>
      </motion.div>
    </div>
  );
}
