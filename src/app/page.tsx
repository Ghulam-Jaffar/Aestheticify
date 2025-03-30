"use client";

import { useState } from "react";
import { VIBES } from "@/vibes";
import VibeLayout from "@/layouts/VibeLayout";

export default function App() {
  const [vibeKey, setVibeKey] = useState<keyof typeof VIBES>("cozy");
  const [showEntry, setShowEntry] = useState(false);

  const VibeComponent = VIBES[vibeKey].component;

  return (
    <VibeLayout
      current={vibeKey}
      onChange={setVibeKey}
      audio={VIBES[vibeKey].audio}
      theme={VIBES[vibeKey].theme}
      showEntry={showEntry}
      setShowEntry={setShowEntry}
    >
      <VibeComponent showEntry={showEntry} setShowEntry={setShowEntry} />
    </VibeLayout>
  );
}
