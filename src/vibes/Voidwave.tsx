"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";
import { motion } from "framer-motion";

export default function Voidwave() {
  const [pet, setPet] = useState("");
  const [font, setFont] = useState("");
  const [caption, setCaption] = useState("");
  const [gridLines, setGridLines] = useState<Array<{
    top: number;
    delay: number;
    duration: number;
    intensity: number;
  }>>([]);

  useEffect(() => {
    setPet(pick(pets));
    setFont(pick(fonts));
    setCaption(pick(captions));

    // Generate grid line data
    const newGridLines = Array.from({ length: 30 }, (_, i) => ({
      top: (i / 30) * 100,
      delay: i * 0.1,
      duration: 4 + Math.random() * 2,
      intensity: 0.3 + Math.random() * 0.4,
    }));
    setGridLines(newGridLines);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
      textShadow: "0 0 7px rgba(128, 0, 255, 0.6), 0 0 10px rgba(128, 0, 255, 0.4)" 
    },
    bright: { 
      textShadow: "0 0 7px rgba(128, 0, 255, 0.9), 0 0 10px rgba(128, 0, 255, 0.7), 0 0 21px rgba(128, 0, 255, 0.5)" 
    }
  };

  return (
    <div
      className={`w-full h-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      {/* Background effects */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.2,
          background: [
            "radial-gradient(circle at 30% 70%, rgba(128, 0, 255, 0.3), transparent 70%)",
            "radial-gradient(circle at 70% 30%, rgba(255, 0, 255, 0.3), transparent 70%)",
            "radial-gradient(circle at 30% 70%, rgba(128, 0, 255, 0.3), transparent 70%)"
          ]
        }}
        transition={{
          opacity: { duration: 2 },
          background: { 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          filter: "blur(40px)",
        }}
      />

      <motion.div
        className="z-10 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-4xl font-bold drop-shadow-glow z-10 mb-2"
          variants={titleVariants}
          animate={{
            textShadow: [
              "0 0 7px rgba(128, 0, 255, 0.6), 0 0 10px rgba(128, 0, 255, 0.4)",
              "0 0 7px rgba(128, 0, 255, 0.9), 0 0 10px rgba(128, 0, 255, 0.7), 0 0 21px rgba(128, 0, 255, 0.5)",
              "0 0 7px rgba(128, 0, 255, 0.6), 0 0 10px rgba(128, 0, 255, 0.4)"
            ],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          🌒 Voidwave
        </motion.h1>
        <motion.div
          className="text-3xl mb-2"
          variants={contentVariants}
          animate={{
            textShadow: [
              "0 0 7px rgba(128, 0, 255, 0.6), 0 0 10px rgba(128, 0, 255, 0.4)",
              "0 0 7px rgba(128, 0, 255, 0.9), 0 0 10px rgba(128, 0, 255, 0.7), 0 0 21px rgba(128, 0, 255, 0.5)",
              "0 0 7px rgba(128, 0, 255, 0.6), 0 0 10px rgba(128, 0, 255, 0.4)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {pet}
        </motion.div>
        <motion.p
          className="text-md text-center max-w-md opacity-70"
          variants={contentVariants}
        >
          {caption}
        </motion.p>
      </motion.div>

      {/* Neon grid lines */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {gridLines.map((line, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] w-full"
            style={{
              top: `${line.top}%`,
              background: "linear-gradient(to right, rgba(128, 0, 255, 0.3), rgba(255, 0, 255, 0.5), rgba(128, 0, 255, 0.3))",
            }}
            initial={{ 
              scaleX: 1, 
              opacity: 0.1 
            }}
            animate={{ 
              scaleX: [1, 1.05, 1],
              opacity: [0.1, line.intensity, 0.1],
            }}
            transition={{
              duration: line.duration,
              delay: line.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Vertical scan line */}
      <motion.div
        className="absolute h-full w-[2px] bg-purple-500/30 z-0"
        initial={{ left: "-10px", opacity: 0 }}
        animate={{ 
          left: ["0%", "100%"],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.5, 1]
        }}
        style={{
          boxShadow: "0 0 15px rgba(128, 0, 255, 0.7)",
          filter: "blur(3px)"
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              opacity: 0,
            }}
            animate={{
              x: [
                `${Math.random() * 100}vw`,
                `${Math.random() * 100}vw`,
                `${Math.random() * 100}vw`,
              ],
              y: [
                `${Math.random() * 100}vh`,
                `${Math.random() * 100}vh`,
                `${Math.random() * 100}vh`,
              ],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: `radial-gradient(circle at center, rgba(${128 + Math.random() * 127}, 0, ${128 + Math.random() * 127}, 0.8), transparent)`,
              boxShadow: `0 0 10px rgba(${128 + Math.random() * 127}, 0, ${128 + Math.random() * 127}, 0.8)`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
