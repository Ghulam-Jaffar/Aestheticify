"use client";

import { VIBES } from "@/vibes";
import Button from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface VibeSwitcherProps {
  current: string;
  onChange: (key: string) => void;
  theme?: "light" | "dark";
  isMobile?: boolean;
}

export default function VibeSwitcher({
  current,
  onChange,
  theme = "dark",
  isMobile = false,
}: VibeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const activeButtonVariants = {
    inactive: { 
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0.1)"
    },
    active: { 
      scale: [1, 1.1, 1],
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transition: { 
        duration: 0.5,
        backgroundColor: { duration: 0.3 }
      }
    }
  };

  // Mobile panel variants
  const panelVariants = {
    closed: { 
      x: "-100%",
      opacity: 0.5,
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.2)",
    },
    open: { 
      x: "0%",
      opacity: 1,
      boxShadow: "5px 0px 15px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  // Toggle button variants
  const toggleButtonVariants = {
    open: { rotate: 0 },
    closed: { rotate: 180 }
  };

  // Handle vibe selection and close panel on mobile
  const handleVibeChange = (key: string) => {
    onChange(key);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <motion.button
          className={`fixed top-20 ${isOpen ? "left-58" : "-left-4"} z-50 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer shadow-lg border border-white/20`}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isOpen ? "open" : "closed"}
          variants={toggleButtonVariants}
          aria-label="Toggle vibe switcher"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {/* Vibe switcher panel - different positioning for mobile vs desktop */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.div 
            ref={panelRef}
            className={`
              ${isMobile 
                ? "fixed top-0 left-0 h-full pt-20 px-4 pb-6 bg-black/90 backdrop-blur-lg z-40 w-64 shadow-xl border-r border-white/10 flex flex-col gap-2" 
                : "absolute top-4 left-4 z-50 flex flex-col gap-2 pt-16"
              }
            `}
            variants={isMobile ? panelVariants : containerVariants}
            initial={isMobile ? "closed" : "hidden"}
            animate={isMobile ? "open" : "visible"}
            exit={isMobile ? "closed" : { opacity: 0 }}
          >
            {isMobile && (
              <div className="mb-4 px-2">
                <h3 className="text-white text-lg font-semibold mb-1">Choose Vibe</h3>
                <p className="text-white/60 text-sm">Select your aesthetic mood</p>
              </div>
            )}
            
            <AnimatePresence mode="sync">
              {Object.entries(VIBES).map(([key, vibe], index) => (
                <motion.div
                  key={key}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  custom={index}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { 
                      delay: index * 0.08,
                      type: "spring", 
                      stiffness: 300, 
                      damping: 24 
                    }
                  }}
                  exit="exit"
                >
                  <motion.div
                    animate={current === key ? "active" : "inactive"}
                    variants={activeButtonVariants}
                    className="w-full rounded-lg"
                  >
                    <Button
                      onClick={() => handleVibeChange(key)}
                      theme={theme}
                      className={`
                        w-full transition-all duration-300
                        ${current === key ? "ring-2" : ""}
                        ${theme === "light" ? "ring-black" : "ring-white"}
                      `}
                    >
                      {vibe.icon} {vibe.name}
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
