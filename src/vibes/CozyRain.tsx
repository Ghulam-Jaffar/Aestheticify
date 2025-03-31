"use client";

import { useState, useEffect } from "react";
import { captions, pets, fonts } from "@/constants/vibePools";
import { pick } from "@/utils/commonMethods";
import { motion } from "framer-motion";

interface DropStyle {
  left: string;
  top: string;
  animationDelay: string;
}

export default function CozyRain() {
  const [pet, setPet] = useState("");
  const [font, setFont] = useState("");
  const [caption, setCaption] = useState("");
  const [drops, setDrops] = useState<DropStyle[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Client-side only initialization
  useEffect(() => {
    setIsClient(true);
    setPet(pick(pets));
    setFont(pick(fonts));
    setCaption(pick(captions));

    // Generate raindrop data only on client side
    const rainDrops = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * -100}%`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    
    setDrops(rainDrops);
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
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
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

  // Render placeholder during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center relative overflow-hidden">
        <div className="z-10 flex flex-col items-center">
          <h1 className="text-5xl font-bold mb-4">☔ Cozy Rain Vibes</h1>
          <div className="text-3xl mb-2"></div>
          <p className="text-lg text-gray-300 max-w-md text-center"></p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center relative overflow-hidden ${font}`}
    >
      {/* Fog/mist effect */}
      <motion.div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.3), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Blurred light spots to simulate window reflections */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={`light-${i}`}
            className="absolute rounded-full bg-blue-100/10"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
            style={{
              width: `${30 + Math.random() * 70}px`,
              height: `${30 + Math.random() * 70}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(20px)",
            }}
          />
        ))}
      </div>

      {/* Floating rain drops */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {drops.map((style, i) => (
          <div
            key={i}
            className="absolute w-1 h-5 bg-white/20 animate-[fall_5s_linear_infinite]"
            style={style}
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
          className="text-5xl font-bold mb-4"
          variants={titleVariants}
          animate={{
            textShadow: [
              "0 0 8px rgba(255, 255, 255, 0.3)",
              "0 0 12px rgba(255, 255, 255, 0.5)",
              "0 0 8px rgba(255, 255, 255, 0.3)",
            ],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          ☔ Cozy Rain Vibes
        </motion.h1>
        <motion.div
          className="text-3xl mb-2"
          variants={contentVariants}
        >
          {pet}
        </motion.div>
        <motion.p
          className="text-lg text-gray-300 max-w-md text-center"
          variants={contentVariants}
        >
          {caption}
        </motion.p>
      </motion.div>

      {/* Window condensation effect */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent 10%, transparent 90%, rgba(255, 255, 255, 0.05))",
            boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.3)",
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes fall {
          to {
            transform: translateY(110vh);
          }
        }
      `}</style>
    </div>
  );
}
