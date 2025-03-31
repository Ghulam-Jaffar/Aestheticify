"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";
import { motion } from "framer-motion";

export default function DreamcoreCloud() {
  const [pet, setPet] = useState("");
  const [font, setFont] = useState("");
  const [caption, setCaption] = useState("");
  const [clouds, setClouds] = useState<Array<{
    top: number;
    left: number;
    size: number;
    opacity: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    setPet(pick(pets));
    setFont(pick(fonts));
    setCaption(pick(captions));

    // Generate cloud data
    const newClouds = Array.from({ length: 15 }, () => ({
      top: Math.random() * 90,
      left: Math.random() * 100,
      size: 200 + Math.random() * 100,
      opacity: 0.6 + Math.random() * 0.2,
      delay: Math.random() * 10,
      duration: 40 + Math.random() * 30,
    }));
    setClouds(newClouds);
  }, []);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
      },
    },
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
      },
    },
  };

  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-[#fceaff] via-[#e8d5ff] to-[#d6ecff] text-purple-800 flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <motion.div
        className="z-10 flex flex-col items-center"
        initial="initial"
        animate="animate"
        variants={containerVariants}
      >
        <motion.h1
          className="text-4xl font-bold drop-shadow-lg z-10 mb-2"
          variants={titleVariants}
          animate={{
            scale: [1, 1.03, 1],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
        >
          ☁️ Dreamcore Cloud
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

      {/* Floating drifting clouds */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {clouds.map((cloud, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full z-20"
            initial={{
              top: `${cloud.top}%`,
              left: `${cloud.left}vw`,
              opacity: 0,
            }}
            animate={{
              left: [`${cloud.left}vw`, `${cloud.left - 200}vw`],
              opacity: [0, cloud.opacity, cloud.opacity, 0],
              scale: [0.9, 1.05, 0.95],
              transition: {
                left: {
                  duration: cloud.duration,
                  delay: cloud.delay,
                  repeat: Infinity,
                  ease: "linear",
                },
                opacity: {
                  duration: cloud.duration * 0.3,
                  times: [0, 0.1, 0.9, 1],
                  repeat: Infinity,
                  repeatDelay: cloud.duration * 0.7,
                },
                scale: {
                  duration: cloud.duration * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }
            }}
            style={{
              width: `${cloud.size}px`,
              height: `${cloud.size / 2}px`,
              background: `radial-gradient(circle at center, rgba(80, 80, 120, 0.9), rgba(255,255,255,0))`,
              filter: "blur(60px)",
            }}
          />
        ))}
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: 0,
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
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0],
              transition: {
                duration: 8 + Math.random() * 15,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              },
            }}
            style={{
              width: `${2 + Math.random() * 6}px`,
              height: `${2 + Math.random() * 6}px`,
              filter: "blur(1px)",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
