import CozyRain from "./CozyRain";
import NeonDream from "./NeonDream";
import DreamcoreCloud from "./DreamcoreCloud";
import StarGarden from "./StarGarden";
import PixelChill from "./PixelChill";
import Voidwave from "./Voidwave";
import DigitalSunrise from "./DigitalSunrise";
import GeneratedVibe from "@/generated/GeneratedVibe";
import { VibeComponentProps } from "@/types/VibeComponent";

type VibeConfig = {
  name: string;
  icon: string;
  audio: string;
  component: React.ComponentType<VibeComponentProps>;
  theme?: "light" | "dark";
};

export const VIBES: Record<string, VibeConfig> = {
  cozy: {
    name: "Cozy Rain",
    icon: "☔",
    audio: "/assets/rain.mp3",
    component: CozyRain,
  },
  neon: {
    name: "Neon Dream",
    icon: "🌌",
    audio: "/assets/synth.mp3",
    component: NeonDream,
  },
  dreamcore: {
    name: "Dreamcore Cloud",
    icon: "☁️",
    audio: "/assets/dreamcore.mp3",
    component: DreamcoreCloud,
    theme: "light",
  },
  star: {
    name: "Star Garden",
    icon: "🌠",
    audio: "/assets/stargarden.mp3",
    component: StarGarden,
  },
  pixel: {
    name: "Pixel Chill",
    icon: "🕹️",
    audio: "/assets/pixel.mp3",
    component: PixelChill,
  },
  voidwave: {
    name: "Voidwave",
    icon: "🌊",
    audio: "/assets/voidwave.mp3",
    component: Voidwave,
  },
  digital: {
    name: "Digital Sunrise",
    icon: "🌅",
    audio: "/assets/digital.mp3",
    component: DigitalSunrise,
    theme: "light",
  },
  random: {
    name: "Random",
    icon: "🎲",
    component: GeneratedVibe,
    audio: "/assets/synth.mp3",
  },
};
