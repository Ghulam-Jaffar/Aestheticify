"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchQuote } from "@/utils/fetchQuote";

interface FloatingQuote {
  id: number;
  quote: string;
  duration: number;
  position: { top: string; left: string };
  isPaused: boolean;
  isPopped: boolean;
  isLeaving: boolean;
}

interface FloatingQuotesProps {
  theme?: "light" | "dark";
}

function getRandomPosition() {
  return {
    top: `${Math.random() * 70 + 10}%`,
    left: `${Math.random() * 70 + 10}%`,
  };
}

export default function FloatingQuotes({
  theme = "dark",
}: FloatingQuotesProps) {
  const [bubbleQueue, setBubbleQueue] = useState<FloatingQuote[]>([]);

  // Floating bubbles
  useEffect(() => {
    const spawn = async () => {
      const quote = await fetchQuote();
      
      // Skip quotes that are too long
      if (quote.length > 100) {
        return;
      }
      
      // Adjust duration based on quote length
      const duration = Math.min(12, 5 + quote.length / 15);
      
      addBubble(quote, duration);
    };
    
    const addBubble = (quote: string, duration: number) => {
      const id = Date.now() + Math.random();
      const position = getRandomPosition();
      setBubbleQueue((prev) => [...prev, { 
        id, 
        quote, 
        duration, 
        position,
        isPaused: false,
        isPopped: false,
        isLeaving: false
      }]);
      
      // Set timeout to remove the bubble after duration
      setTimeout(() => {
        setBubbleQueue((prev) => {
          // Only remove if not paused
          return prev.filter((b) => b.id !== id || b.isPaused);
        });
      }, duration * 1000);
    };

    const interval = setInterval(spawn, 6000);
    spawn();
    return () => clearInterval(interval);
  }, []);

  // Handle hover pause
  const handleMouseEnter = (id: number) => {
    setBubbleQueue(prev => 
      prev.map(bubble => 
        bubble.id === id ? { ...bubble, isPaused: true } : bubble
      )
    );
  };

  // Handle mouse leave - resume animation
  const handleMouseLeave = (id: number) => {
    // Find the bubble
    const bubble = bubbleQueue.find(b => b.id === id);
    if (!bubble) return;
    
    // Mark it as not paused
    setBubbleQueue(prev => 
      prev.map(b => b.id === id ? { ...b, isPaused: false, isLeaving: true } : b)
    );
    
    // Remove it after a short delay - this prevents it from reappearing
    setTimeout(() => {
      setBubbleQueue(prev => prev.filter(b => b.id !== id));
    }, 500);
  };

  // Handle click to pop
  const handleClick = (id: number, e: React.MouseEvent) => {
    // Stop propagation to prevent clicks from reaching elements underneath
    e.stopPropagation();
    
    setBubbleQueue(prev => 
      prev.map(bubble => 
        bubble.id === id ? { ...bubble, isPopped: true } : bubble
      )
    );
    
    // Remove the popped bubble after animation
    setTimeout(() => {
      setBubbleQueue(prev => prev.filter(b => b.id !== id));
    }, 500); // Pop animation duration
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {bubbleQueue.map(({ id, quote, position, duration, isPaused, isPopped, isLeaving }) => (
          <motion.div
            key={id}
            className={`absolute text-sm px-4 py-3 rounded-xl backdrop-blur-sm z-30 leading-relaxed cursor-pointer pointer-events-auto
              ${
                theme === "light"
                  ? "bg-black/10 text-black"
                  : "bg-white/10 text-white"
              }`}
            style={{
              ...position,
              maxWidth: "250px",
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={
              isPopped 
                ? { 
                    opacity: 0, 
                    scale: 1.5, 
                    y: -30,
                    transition: { duration: 0.5, ease: "easeOut" }
                  }
                : isPaused
                ? { 
                    opacity: 1, 
                    scale: 1.05, 
                    y: 0,
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                    transition: { duration: 0.2 }
                  }
                : isLeaving
                ? { 
                    opacity: 0, 
                    scale: 0.8, 
                    y: -10,
                    transition: { duration: 0.5 }
                  }
                : { 
                    opacity: [0, 1, 1, 0], 
                    scale: [0.9, 1, 1, 0.95], 
                    y: [10, 0, 0, -10],
                    transition: { 
                      duration: duration,
                      times: [0, 0.1, 0.9, 1],
                      ease: "easeInOut"
                    }
                  }
            }
            exit={{ opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.3 } }}
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={() => handleMouseLeave(id)}
            onClick={(e) => handleClick(id, e)}
          >
            {quote}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
