"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";
import { motion } from "framer-motion";

export default function PixelChill() {
  const [pet, setPet] = useState("");
  const [font, setFont] = useState("");
  const [caption, setCaption] = useState("");
  const [pixels, setPixels] = useState<Array<{
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    setPet(pick(pets));
    setFont(pick(fonts));
    setCaption(pick(captions));

    // Generate pixel data
    const colors = [
      "#9ae1ff", // Light blue
      "#ff9ae1", // Pink
      "#e1ff9a", // Light green
      "#e19aff", // Purple
    ];

    const newPixels = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPixels(newPixels);
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
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: 0.2,
      },
    },
  };

  return (
    <div
      className={`w-full h-full bg-[#1d1f2f] text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      {/* Background grid */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="w-full h-full" style={{ 
          backgroundImage: "linear-gradient(to right, #9ae1ff20 1px, transparent 1px), linear-gradient(to bottom, #9ae1ff20 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }} />
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
            textShadow: ["0 0 8px #9ae1ff60", "0 0 16px #9ae1ff90", "0 0 8px #9ae1ff60"],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          🕹️ Pixel Chill
        </motion.h1>
        <motion.div
          className="text-3xl mb-2"
          variants={contentVariants}
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

      {/* Floating pixels */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {pixels.map((pixel, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: `${pixel.x}vw`,
              y: `${pixel.y}vh`,
              opacity: 0,
            }}
            animate={{
              y: [`${pixel.y}vh`, `${pixel.y - 80}vh`],
              opacity: [0, 0.9, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: pixel.duration,
              delay: pixel.delay,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
            style={{
              width: `${pixel.size}px`,
              height: `${pixel.size}px`,
              backgroundColor: pixel.color,
              boxShadow: `0 0 ${pixel.size * 2}px ${pixel.color}`,
            }}
          />
        ))}
      </div>

      {/* Horizontal scan lines */}
      <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`scan-${i}`}
            className="absolute w-full h-[1px] bg-[#9ae1ff30]"
            style={{
              top: `${(i / 20) * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scaleY: [1, 2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Retro CRT vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.4) 100%)",
          mixBlendMode: "multiply"
        }}
      />
    </div>
  );
}
