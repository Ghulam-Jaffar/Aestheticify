"use client";

import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import Button from "@/components/UI/Button";

interface AudioToggleProps {
  src: string;
  volume?: number;
  theme?: "dark" | "light";
}

export default function AudioToggle({
  src,
  volume = 0.5,
  theme = "dark",
}: AudioToggleProps) {
  const [playing, setPlaying] = useState(true);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!src) return;

    const sound = new Howl({
      src: [src],
      loop: true,
      volume,
    });

    sound.play();
    soundRef.current = sound;

    return () => {
      sound.unload();
    };
  }, [src, volume]);

  const toggle = () => {
    if (!soundRef.current) return;
    playing ? soundRef.current.pause() : soundRef.current.play();
    setPlaying(!playing);
  };

  return (
    <Button
      onClick={toggle}
      theme={theme}
      className="absolute bottom-4 right-4 z-50"
    >
      {playing ? "🔈 Mute" : "🔇 Unmute"}
    </Button>
  );
}
