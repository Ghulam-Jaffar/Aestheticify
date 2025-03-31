"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";
import { motion } from "framer-motion";

export default function StarGarden() {
  const [pet, setPet] = useState("");
  const [font, setFont] = useState("");
  const [caption, setCaption] = useState("");
  const [stars, setStars] = useState<Array<{
    left: number;
    top: number;
    size: number;
    opacity: number;
    delay: number;
    duration: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    setPet(pick(pets));
    setFont(pick(fonts));
    setCaption(pick(captions));

    // Generate star data - fewer stars for wishing star effect
    const newStars = Array.from({ length: 5 }, () => ({
      left: -5, // Start from left side
      top: 20 + Math.random() * 60, // Appear in middle portion of screen
      size: 0.5 + Math.random() * 1, // Smaller size
      opacity: 0.6 + Math.random() * 0.4,
      delay: 5 + Math.random() * 15, // Much longer delays between stars
      duration: 2 + Math.random() * 2, // Faster movement
      rotation: Math.random() * 15,
    }));
    setStars(newStars);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
      },
    },
  };

  return (
    <div
      className={`w-full h-full bg-gradient-to-t from-indigo-900 via-violet-800 to-black text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      {/* Starry background */}
      <div className="absolute inset-0 z-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`bg-star-${i}`}
            className="absolute rounded-full bg-white"
            initial={{ opacity: 0.1 + Math.random() * 0.5 }}
            animate={{ 
              opacity: [0.1 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.1 + Math.random() * 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 3px rgba(255, 255, 255, 0.7)",
            }}
          />
        ))}
      </div>

      <motion.div
        className="z-10 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-4xl font-bold z-10 mb-2"
          variants={titleVariants}
          animate={{
            textShadow: [
              "0 0 8px rgba(255, 255, 255, 0.5)",
              "0 0 16px rgba(255, 255, 255, 0.8)",
              "0 0 8px rgba(255, 255, 255, 0.5)",
            ],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          🌠 Star Garden
        </motion.h1>
        <motion.div
          className="text-3xl mb-2"
          variants={contentVariants}
        >
          {pet}
        </motion.div>
        <motion.p
          className="text-md max-w-md text-center opacity-80"
          variants={contentVariants}
        >
          {caption}
        </motion.p>
      </motion.div>

      {/* Falling stars */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              left: "-5%",
              top: `${star.top}%`,
              opacity: 0,
              rotate: star.rotation,
            }}
            animate={{
              left: ["-5%", "110%"],
              opacity: [0, star.opacity, 0],
              rotate: [star.rotation, star.rotation + 5],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeOut",
              times: [0, 0.7, 1],
            }}
          >
            <div 
              className="bg-gradient-to-r from-white/10 via-white/90 to-white/10 blur-[1px]"
              style={{
                width: `${star.size * 40}px`,
                height: `${star.size}px`,
                borderRadius: "full",
                boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Nebula effect */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.5), transparent 70%), radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.5), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
