"use client";

import { useEffect, useRef, useState } from "react";

interface BarStyle {
  top: string;
  left: string;
  width: string;
  height: string;
  backgroundColor: string;
  transform: string;
  animationDuration: string;
}

export default function FlickerBar() {
  const [style, setStyle] = useState<BarStyle>(randomBarStyle());
  const ref = useRef<HTMLDivElement>(null);

  function randomBarStyle(): BarStyle {
    const colors = ["#00ffff", "#ff00ff", "#ffffff"];
    const duration = (0.8 + Math.random() * 0.8).toFixed(2);

    return {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${100 + Math.random() * 100}px`,
      height: `${Math.random() > 0.7 ? 4 : 2}px`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      transform: `rotate(${Math.random() * 90 - 45}deg)`,
      animationDuration: `${duration}s`,
    };
  }

  useEffect(() => {
    const cycle = () => {
      setStyle(randomBarStyle());
    };

    const durationMs = parseFloat(style.animationDuration) * 1000;
    const timer = setInterval(cycle, durationMs);

    return () => clearInterval(timer);
  }, [style.animationDuration]);

  return (
    <div
      ref={ref}
      className="absolute blur-[1px]"
      style={{
        ...style,
        animationName: "synthBarFlicker",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDuration: style.animationDuration,
        animationDelay: `${Math.random() * 3}s`,
        boxShadow: `0 0 6px ${style.backgroundColor}, 0 0 20px ${style.backgroundColor}`,
        transformOrigin: "bottom",
        opacity: 0.8,
      }}
    />
  );
}
