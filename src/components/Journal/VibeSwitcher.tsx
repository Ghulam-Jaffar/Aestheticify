"use client";

import { VIBES } from "@/vibes";
import Button from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";

interface VibeSwitcherProps {
  current: string;
  onChange: (key: string) => void;
  theme?: "light" | "dark";
}

export default function VibeSwitcher({
  current,
  onChange,
  theme = "dark",
}: VibeSwitcherProps) {
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

  return (
    <motion.div 
      className="absolute top-4 left-4 z-50 flex flex-col gap-2 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
              className="w-full"
            >
              <Button
                onClick={() => onChange(key)}
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
  );
}
