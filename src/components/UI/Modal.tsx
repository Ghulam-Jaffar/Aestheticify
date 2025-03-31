"use client";

// example usage
// <Modal onClose={() => setShowEntry(false)}>
// <p>This is a simple modal message.</p>
// </Modal>

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  theme?: "light" | "dark";
  custom?: boolean;
  className?: string;
}

export default function Modal({
  children,
  onClose,
  theme = "dark",
  custom = false,
  className = "",
}: ModalProps) {
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {custom ? (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          className={`relative bg-white/10 text-white w-full mx-4 p-6 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 ${className}`}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-white hover:opacity-70 cursor-pointer"
            >
              ✖
            </button>
          )}
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
