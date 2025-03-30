import { Dispatch, SetStateAction } from "react";

export interface VibeComponentProps {
  showEntry: boolean;
  setShowEntry: Dispatch<SetStateAction<boolean>>;
  theme?: "light" | "dark";
}

export interface Vibe {
  bg: string;
  font: string;
  pet: string;
  quote: string;
  audio: string;
  trackUrl?: string;
}
