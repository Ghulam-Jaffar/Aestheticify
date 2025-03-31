"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";
import { motion } from "framer-motion";
import FlickerBar from "@/components/Journal/FlickerBar";

export default function NeonDream() {
  const [pet, setPet] = useState("");
  const [font, setFont] = useState("");
  const [caption, setCaption] = useState("");
  const [gridOpacity, setGridOpacity] = useState(0);

  useEffect(() => {
    setPet(pick(pets));
    setFont(pick(fonts));
    setCaption(pick(captions));
    
    // Fade in grid
    const timer = setTimeout(() => {
      setGridOpacity(0.2);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Content animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
    },
  };

  // Neon glow animation
  const glowVariants = {
    dim: { 
      textShadow: "0 0 7px rgba(255, 0, 255, 0.6), 0 0 10px rgba(255, 0, 255, 0.4)" 
    },
    bright: { 
      textShadow: "0 0 7px rgba(255, 0, 255, 0.9), 0 0 10px rgba(255, 0, 255, 0.7), 0 0 21px rgba(255, 0, 255, 0.5), 0 0 42px rgba(255, 0, 255, 0.3)" 
    }
  };

  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-purple-700 via-pink-500 to-indigo-900 text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <motion.div
        className="z-10 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-5xl font-bold mb-2"
          variants={titleVariants}
          animate={{
            textShadow: [
              "0 0 7px rgba(255, 0, 255, 0.6), 0 0 10px rgba(255, 0, 255, 0.4)",
              "0 0 7px rgba(255, 0, 255, 0.9), 0 0 10px rgba(255, 0, 255, 0.7), 0 0 21px rgba(255, 0, 255, 0.5), 0 0 42px rgba(255, 0, 255, 0.3)",
              "0 0 7px rgba(255, 0, 255, 0.6), 0 0 10px rgba(255, 0, 255, 0.4)"
            ],
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          🌌 Neon Dream
        </motion.h1>
        <motion.div
          className="text-3xl mb-2"
          variants={glowVariants}
          initial="dim"
          animate="bright"
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {pet}
        </motion.div>
        <motion.p
          className="text-md text-center max-w-md opacity-80"
          variants={contentVariants}
        >
          {caption}
        </motion.p>
      </motion.div>

      {/* Vibe FX */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid overlay with animated opacity */}
        <motion.div
          className="absolute bottom-0 w-full h-full z-0 bg-no-repeat bg-bottom bg-cover"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: gridOpacity,
            y: [0, -5, 0],
          }}
          transition={{
            opacity: { duration: 2 },
            y: { 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
          style={{ backgroundImage: "url('/assets/grid.png')" }}
        />

        {/* Flicker bars using the component */}
        <FlickerBar className="z-0" />

        {/* Horizontal scan line */}
        <motion.div
          className="absolute w-full h-[2px] bg-cyan-500/30 z-0"
          initial={{ top: "-10px", opacity: 0 }}
          animate={{ 
            top: ["0%", "100%"],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.5, 1]
          }}
          style={{
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
            filter: "blur(3px)"
          }}
        />
      </div>
    </div>
  );
}
