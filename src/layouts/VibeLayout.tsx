"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence, usePresence, useAnimate } from "framer-motion";
import AudioToggle from "@/components/Journal/AudioToggle";
import VibeSwitcher from "@/components/Journal/VibeSwitcher";
import FloatingQuotes from "@/components/Journal/FloatingQuotes";
import SynthPet from "@/components/Journal/SynthPet";
import Button from "@/components/UI/Button";
import { VIBES } from "@/vibes";

interface VibeLayoutProps {
  current: string;
  onChange: (key: string) => void;
  audio: string;
  theme?: "light" | "dark";
  showEntry: boolean;
  setShowEntry: (val: boolean) => void;
  children: ReactNode;
}

export default function VibeLayout({
  current,
  onChange,
  audio,
  theme = "dark",
  showEntry,
  setShowEntry,
  children,
}: VibeLayoutProps) {
  const [cycleMode, setCycleMode] = useState(false);
  const showAudioToggle = current !== "random";
  const [scope, animate] = useAnimate();
  const [isPresent, safeToRemove] = usePresence();

  // Set up cycling through vibes if enabled
  useEffect(() => {
    if (!cycleMode) return;

    const vibeKeys = Object.keys(VIBES);

    const interval = setInterval(() => {
      const index = vibeKeys.indexOf(current);
      const next = vibeKeys[(index + 1) % vibeKeys.length];
      onChange(next);
    }, 20000);

    return () => clearInterval(interval);
  }, [cycleMode, current, onChange]);

  // Advanced page transition animation
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 1.03,
      filter: "blur(5px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      filter: "blur(5px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  // Controls animation with stagger effect
  const controlsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const controlItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: 15,
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { 
      scale: 0.95,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 10 
      } 
    },
  };

  // Handle presence for smooth unmounting
  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        await animate(scope.current, { opacity: 0 }, { duration: 0.5 });
        safeToRemove();
      };
      exitAnimation();
    }
  }, [isPresent, safeToRemove, animate, scope]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black" ref={scope}>
      {/* Main content with improved AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="w-full h-full relative z-30"
          layoutId="main-content"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* UI overlay with improved animations (only if journal not open) */}
      <AnimatePresence>
        {!showEntry && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 pointer-events-none z-40"
          >
            <motion.div 
              variants={controlsContainerVariants}
              className="pointer-events-none"
            >
              <motion.div 
                variants={controlItemVariants}
                className="pointer-events-auto"
              >
                <VibeSwitcher current={current} onChange={onChange} theme={theme} />
              </motion.div>
              
              {showAudioToggle && (
                <motion.div 
                  variants={controlItemVariants}
                  className="pointer-events-auto"
                >
                  <AudioToggle src={audio} volume={0.5} theme={theme} />
                </motion.div>
              )}
              
              <motion.div 
                variants={controlItemVariants}
                className="pointer-events-auto"
              >
                <SynthPet theme={theme} />
              </motion.div>

              {current !== "random" && (
                <motion.div 
                  className="absolute bottom-4 left-4 z-50 pointer-events-auto"
                  variants={controlItemVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.div variants={buttonVariants}>
                    <Button
                      onClick={() => setCycleMode((prev) => !prev)}
                      theme={theme}
                    >
                      {cycleMode ? "🔁 Cycling On" : "⏹️ Cycling Off"}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { 
                  delay: 1.2,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.3 }
              }}
            >
              <FloatingQuotes theme={theme} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
