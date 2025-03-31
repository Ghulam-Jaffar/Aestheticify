"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emojis = ["🐱", "🐰", "🦊", "🐸", "🐥", "🧸", "👾", "🌸"];
const quotes = [
  "Stay curious.",
  "Vibe higher.",
  "You are seen.",
  "Glitch in peace.",
  "Code the calm.",
  "Be soft and strange.",
  "Digital dreams.",
  "Pixel perfect.",
];

// Pet states for different animations
const petStates = {
  IDLE: "idle",
  FOLLOWING: "following",
  EXCITED: "excited",
  SLEEPING: "sleeping",
};

interface Props {
  theme?: "light" | "dark";
}

interface Position {
  x: number;
  y: number;
}

export default function SynthPet({ theme = "dark" }: Props) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [target, setTarget] = useState<Position>({ x: 0, y: 0 });
  const [emoji, setEmoji] = useState<string>("🐱");
  const [bubble, setBubble] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [petState, setPetState] = useState(petStates.IDLE);
  const lastMoveRef = useRef(Date.now());
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationSeedRef = useRef<number[]>([]);

  // Init safely after client mount
  useEffect(() => {
    // Generate consistent animation seeds
    animationSeedRef.current = Array.from({ length: 10 }, () => Math.random());
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight - 80;
    setPosition({ x: centerX, y: centerY });
    setTarget({ x: centerX, y: centerY });
    
    // Random emoji on mount - only on client side
    const randomIndex = Math.floor(animationSeedRef.current[0] * emojis.length);
    setEmoji(emojis[randomIndex]);
    
    setReady(true);
  }, []);

  // Smooth movement with dynamic easing
  useEffect(() => {
    if (!ready) return;
    
    const interval = setInterval(() => {
      // Calculate distance to target
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Dynamic easing based on distance
      // Faster when far away, slower when close
      const easing = Math.min(0.2, 0.05 + (distance / 1000));
      
      // Update position with easing
      setPosition((prev) => {
        const newX = prev.x + dx * easing;
        const newY = prev.y + dy * easing;
        
        // If we're very close to target, snap to it
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          return { x: target.x, y: target.y };
        }
        
        return { x: newX, y: newY };
      });
      
      // Update pet state based on movement
      if (distance > 50) {
        setPetState(petStates.FOLLOWING);
      } else if (distance < 5 && petState === petStates.FOLLOWING) {
        setPetState(petStates.IDLE);
      }
    }, 16); // 60fps for smoother animation
    
    return () => clearInterval(interval);
  }, [target, ready, position, petState]);

  // Mouse follow & idle behaviors
  useEffect(() => {
    if (!ready) return;

    const handleMove = (e: MouseEvent) => {
      lastMoveRef.current = Date.now();
      
      // Clear any pending idle timeout
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      
      // Set target with slight offset to make it follow behind cursor
      setTarget({ 
        x: e.clientX - 32, 
        y: e.clientY - 32 
      });
      
      // Briefly get excited when mouse moves quickly
      const speed = Math.sqrt(
        Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)
      );
      
      if (speed > 20) {
        setPetState(petStates.EXCITED);
        // Return to following state after a short delay
        setTimeout(() => {
          setPetState(petStates.FOLLOWING);
        }, 500);
      }
      
      // Set timeout to go idle
      idleTimeoutRef.current = setTimeout(() => {
        setPetState(petStates.IDLE);
        
        // After longer inactivity, start wandering or sleeping
        setTimeout(() => {
          if (Date.now() - lastMoveRef.current > 10000) {
            // Use consistent seed for randomness
            const randomValue = animationSeedRef.current[1];
            
            // 50% chance to sleep, 50% chance to wander
            if (randomValue > 0.5) {
              setPetState(petStates.SLEEPING);
            } else {
              // Wander around current position using consistent seeds
              const seedX = animationSeedRef.current[2];
              const seedY = animationSeedRef.current[3];
              
              const wanderX = position.x + ((seedX * 2 - 1) * 100);
              const wanderY = position.y + ((seedY * 2 - 1) * 100);
              
              // Keep within viewport bounds
              const boundedX = Math.max(50, Math.min(window.innerWidth - 50, wanderX));
              const boundedY = Math.max(50, Math.min(window.innerHeight - 50, wanderY));
              
              setTarget({ x: boundedX, y: boundedY });
            }
          }
        }, 5000);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMove);
    
    // Initial idle behavior
    idleTimeoutRef.current = setTimeout(() => {
      setPetState(petStates.IDLE);
    }, 3000);
    
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      window.removeEventListener("mousemove", handleMove);
    };
  }, [ready, position]);

  // Change emoji on theme change
  useEffect(() => {
    // Use consistent seed for randomness
    const randomIndex = Math.floor(animationSeedRef.current[4] * emojis.length);
    setEmoji(emojis[randomIndex]);
    
    // Show excitement on theme change
    setPetState(petStates.EXCITED);
    setTimeout(() => {
      setPetState(petStates.IDLE);
    }, 1000);
  }, [theme]);

  const handleClick = () => {
    // Generate a new random index each time for variety
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    setBubble(quote);
    
    // Show excitement when clicked
    setPetState(petStates.EXCITED);
    
    // Return to previous state after showing quote
    setTimeout(() => {
      setBubble(null);
      setPetState(petStates.IDLE);
    }, 3000);
  };

  if (!ready) return null;

  // Get animation variants based on current pet state
  const getPetAnimationVariants = () => {
    // Use consistent values for animations
    const seed1 = animationSeedRef.current[6] || 0;
    const seed2 = animationSeedRef.current[7] || 0;
    
    switch (petState) {
      case petStates.FOLLOWING:
        return {
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
          transition: { 
            duration: 0.8, 
            ease: "easeInOut",
            repeat: Infinity,
          }
        };
      case petStates.EXCITED:
        return {
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, 10, -10, 5, 0],
          transition: { 
            duration: 0.5, 
            ease: "easeInOut",
          }
        };
      case petStates.SLEEPING:
        return {
          scale: [1, 0.95, 1],
          transition: { 
            duration: 2, 
            ease: "easeInOut",
            repeat: Infinity,
          }
        };
      case petStates.IDLE:
      default:
        return {
          scale: [1, 1.03, 1],
          y: [0, -3, 0],
          transition: { 
            duration: 2, 
            ease: "easeInOut",
            repeat: Infinity,
          }
        };
    }
  };

  return (
    <>
      <AnimatePresence>
        {bubble && (
          <motion.div
            key="speech-bubble"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed text-sm px-3 py-2 rounded-xl backdrop-blur pointer-events-none z-50 ${
              theme === "light" 
                ? "bg-black/10 text-black" 
                : "bg-white/20 text-white"
            }`}
            style={{
              left: position.x - 60,
              top: position.y - 60,
              boxShadow: theme === "light" 
                ? "0 0 10px rgba(0,0,0,0.1)" 
                : "0 0 10px rgba(255,255,255,0.1)",
            }}
          >
            {bubble}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed z-50"
        onClick={handleClick}
        style={{
          x: position.x,
          y: position.y,
        }}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
      >
        <motion.div
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer hover:scale-110 
            ${
              theme === "light"
                ? "bg-black/10 text-black"
                : "bg-white/10 text-white"
            }`}
          style={{
            boxShadow:
              theme === "light"
                ? "0 0 15px rgba(0,0,0,0.2)"
                : "0 0 15px rgba(255,255,255,0.15)",
          }}
          animate={getPetAnimationVariants()}
        >
          <motion.div 
            animate={
              petState === petStates.SLEEPING 
                ? { 
                    rotateZ: 90,
                    transition: { duration: 0.5 }
                  } 
                : { 
                    rotateZ: 0,
                    transition: { duration: 0.5 }
                  }
            }
          >
            {emoji}
          </motion.div>
          
          {/* ZZZ animation for sleeping state */}
          <AnimatePresence>
            {petState === petStates.SLEEPING && (
              <motion.div 
                key="sleeping-zzz"
                className="absolute -top-4 -right-2 text-xs"
                initial={{ opacity: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [-5, -15],
                  x: [0, 5]
                }}
                exit={{ opacity: 0, y: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                💤
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
