"use client";

import { VIBES } from "@/vibes";
import Button from "@/components/UI/Button";

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
  return (
    <div className="absolute top-4 left-4 z-50 flex flex-col gap-2 pt-16">
      {Object.entries(VIBES).map(([key, vibe]) => (
        <Button
          key={key}
          onClick={() => onChange(key)}
          theme={theme}
          className={`
            ${current === key ? "ring-2" : ""}
            ${theme === "light" ? "ring-black" : "ring-white"}
          `}
        >
          {vibe.icon} {vibe.name}
        </Button>
      ))}
    </div>
  );
}
