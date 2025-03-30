"use client";

// example usage
// <Modal onClose={() => setShowEntry(false)}>
// <p>This is a simple modal message.</p>
// </Modal>

import React, { ReactNode } from "react";

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
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 animate-fade-in">
      {custom ? (
        children
      ) : (
        <div
          className={`relative bg-white/10 text-white w-full mx-4 p-6 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 ${className}`}
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
        </div>
      )}
    </div>
  );
}
