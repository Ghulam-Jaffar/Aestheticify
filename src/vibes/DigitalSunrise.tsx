"use client";

import { useState, useEffect } from "react";
import { fonts, pets, captions } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";
import { motion } from "framer-motion";

export default function DigitalSunrise() {
  const [pet, setPet] = useState("");
  const [font, setFont] = useState("");
  const [caption, setCaption] = useState("");
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speed: number; delay: number }>>([]);

  useEffect(() => {
    setPet(pick(pets));
    setFont(pick(fonts));
    setCaption(pick(captions));
    
    // Generate light particles
    const newParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      speed: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Animation variants
  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div
      className={`w-full h-full bg-gradient-to-b from-orange-200 via-pink-300 to-purple-500 text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      <motion.div
        className="z-10 flex flex-col items-center"
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        <motion.h1 
          className="text-4xl font-bold z-10 mb-2 text-center drop-shadow-lg"
          variants={titleVariants}
        >
          🌅 Digital Sunrise
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

      {/* Rising glow rings */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-end justify-center">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.1, 0.8],
              transition: {
                duration: 8 + i * 1,
                delay: i * 1.8,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              width: `${120 + i * 100}px`,
              height: `${120 + i * 100}px`,
              bottom: "0px",
              border: `2px solid rgba(255, 255, 255, 0.2)`,
              boxShadow: `0 0 40px rgba(255, 255, 255, 0.15)`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Light particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`, 
              opacity: 0 
            }}
            animate={{ 
              y: [`${particle.y}vh`, `${particle.y - particle.speed * 20}vh`],
              opacity: [0, 0.8, 0],
              transition: {
                duration: particle.speed * 2,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.8)`,
            }}
          />
        ))}
      </div>

      {/* Sun glow */}
      <motion.div 
        className="absolute rounded-full bg-gradient-to-r from-yellow-200 to-orange-300 opacity-70 z-0"
        initial={{ bottom: "-50vh", scale: 0.8, opacity: 0.4 }}
        animate={{ 
          bottom: "-30vh",
          scale: 1.2,
          opacity: [0.4, 0.7, 0.4],
          transition: {
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        style={{
          width: "80vh",
          height: "80vh",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
