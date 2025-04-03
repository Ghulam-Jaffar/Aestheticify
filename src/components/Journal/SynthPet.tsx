"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

const emojis = ["🐱", "🐰", "🦊", "🐸", "🐥", "🧸", "👾", "🌸"];

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
  // Use motion values for smoother animations without re-renders
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Use refs for values that don't need to trigger re-renders
  const targetRef = useRef<Position>({ x: 0, y: 0 });
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const lastMoveRef = useRef(Date.now());
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationSeedRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  // State that needs to trigger re-renders
  const [emoji, setEmoji] = useState<string>("🐱");
  const [bubble, setBubble] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [petState, setPetState] = useState(petStates.IDLE);

  // Init safely after client mount
  useEffect(() => {
    // Generate consistent animation seeds
    animationSeedRef.current = Array.from({ length: 10 }, () => Math.random());
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight - 80;
    
    // Initialize position and target
    positionRef.current = { x: centerX, y: centerY };
    targetRef.current = { x: centerX, y: centerY };
    
    // Set motion values
    x.set(centerX);
    y.set(centerY);
    
    // Random emoji on mount - only on client side
    const randomIndex = Math.floor(animationSeedRef.current[0] * emojis.length);
    setEmoji(emojis[randomIndex]);
    
    setReady(true);
    
    // Start animation loop
    startAnimationLoop();
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animation loop using requestAnimationFrame instead of setInterval
  // This is more efficient and syncs with the browser's refresh rate
  const startAnimationLoop = useCallback(() => {
    const updatePosition = () => {
      // Calculate distance to target
      const dx = targetRef.current.x - positionRef.current.x;
      const dy = targetRef.current.y - positionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Dynamic easing based on distance
      // Faster when far away, slower when close
      const easing = Math.min(0.2, 0.05 + (distance / 1000));
      
      // Update position with easing
      if (distance > 0.5) {
        positionRef.current.x += dx * easing;
        positionRef.current.y += dy * easing;
        
        // Update motion values (this is optimized in framer-motion)
        x.set(positionRef.current.x);
        y.set(positionRef.current.y);
        
        // Update pet state based on movement (only when state would change)
        if (distance > 50 && petState !== petStates.FOLLOWING) {
          setPetState(petStates.FOLLOWING);
        } else if (distance < 5 && petState === petStates.FOLLOWING) {
          setPetState(petStates.IDLE);
        }
      }
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };
    
    animationFrameRef.current = requestAnimationFrame(updatePosition);
  }, [petState]);

  // Mouse follow & idle behaviors - optimized to reduce calculations
  useEffect(() => {
    if (!ready) return;

    const handleMove = (e: MouseEvent) => {
      lastMoveRef.current = Date.now();
      
      // Clear any pending idle timeout
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      
      // Set target with a significant offset to bottom-right of cursor
      targetRef.current = { 
        x: e.clientX + 40, 
        y: e.clientY + 40 
      };
      
      // Only update state for significant movements to reduce renders
      const movementMagnitude = Math.sqrt(
        Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)
      );
      
      if (movementMagnitude > 20 && petState !== petStates.EXCITED) {
        setPetState(petStates.EXCITED);
        // Return to following state after a short delay
        setTimeout(() => {
          setPetState(petStates.FOLLOWING);
        }, 500);
      }
      
      // Debounced idle state change
      idleTimeoutRef.current = setTimeout(() => {
        setPetState(petStates.IDLE);
        
        // After longer inactivity, start wandering or sleeping
        setTimeout(() => {
          if (Date.now() - lastMoveRef.current > 10000) {
            const randomValue = animationSeedRef.current[1];
            
            if (randomValue > 0.5) {
              setPetState(petStates.SLEEPING);
            } else {
              // Wander around current position using consistent seeds
              const seedX = animationSeedRef.current[2];
              const seedY = animationSeedRef.current[3];
              
              const wanderX = positionRef.current.x + ((seedX * 2 - 1) * 100);
              const wanderY = positionRef.current.y + ((seedY * 2 - 1) * 100);
              
              // Keep within viewport bounds
              const boundedX = Math.max(50, Math.min(window.innerWidth - 50, wanderX));
              const boundedY = Math.max(50, Math.min(window.innerHeight - 50, wanderY));
              
              targetRef.current = { x: boundedX, y: boundedY };
            }
          }
        }, 5000);
      }, 3000);
    };

    // Use passive event listener for better performance
    window.addEventListener("mousemove", handleMove, { passive: true });
    
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
  }, [ready, petState]);

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

  if (!ready) return null;

  // Get animation variants based on current pet state
  const getPetAnimationVariants = () => {
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
              left: positionRef.current.x - 60,
              top: positionRef.current.y - 60,
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
        style={{ x, y }}
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
                ✨
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
