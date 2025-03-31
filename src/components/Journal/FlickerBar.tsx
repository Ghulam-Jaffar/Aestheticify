"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FlickerBarProps {
  className?: string;
}

export default function FlickerBar({ className = "" }: FlickerBarProps) {
  const [bars, setBars] = useState<Array<{
    left: number;
    height: number;
    width: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    // Generate multiple flicker bars
    const newBars = Array.from({ length: 25 }, () => generateBarProps());
    setBars(newBars);

    // Refresh bars periodically
    const interval = setInterval(() => {
      setBars(Array.from({ length: 25 }, () => generateBarProps()));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  function generateBarProps() {
    const colors = [
      "from-purple-500 to-pink-300",
      "from-cyan-500 to-blue-300",
      "from-pink-500 to-purple-300",
    ];
    
    return {
      left: Math.random() * 100,
      height: 30 + Math.random() * 150,
      width: 3 + Math.random() * 5,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className={`absolute bottom-0 bg-gradient-to-t ${bar.color}`}
          initial={{ 
            height: bar.height * 0.4, 
            opacity: 0.5,
            scaleY: 0.4
          }}
          animate={{
            height: [
              bar.height * 0.4,
              bar.height * 1.2,
              bar.height * 0.6,
              bar.height * 1.4,
              bar.height * 0.4
            ],
            opacity: [0.5, 0.9, 0.7, 1, 0],
            scaleY: [0.4, 1.2, 0.6, 1.4, 0.4]
          }}
          transition={{
            duration: bar.duration,
            delay: bar.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
          style={{
            left: `${bar.left}%`,
            width: `${bar.width}px`,
            filter: "blur(1px)",
            boxShadow: "0 0 8px rgba(255, 0, 255, 0.7)",
          }}
        />
      ))}
    </div>
  );
}
