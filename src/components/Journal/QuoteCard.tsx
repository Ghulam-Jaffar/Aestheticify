"use client";

import React, { useEffect } from "react";

interface QuoteCardProps {
  quote: string;
  duration: number;
  onDone?: () => void;
}

export default function QuoteCard({ quote, duration, onDone }: QuoteCardProps) {
  useEffect(() => {
    if (!onDone) return;
    const timer = setTimeout(() => onDone(), duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <div
      className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-xl max-w-lg text-center text-lg leading-relaxed animate-fade-card z-50 pointer-events-none"
      style={
        {
          "--duration": `${duration}s`,
        } as React.CSSProperties
      }
    >
      <div className="text-3xl mb-2 opacity-40">“</div>
      {quote}
    </div>
  );
}
