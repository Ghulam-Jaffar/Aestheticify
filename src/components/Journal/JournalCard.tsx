"use client";

import { useState } from "react";
import Button from "@/components/UI/Button";
import { Vibe } from "@/types/VibeComponent";
import { saveVibe } from "@/utils/saveVibe";
import toast from "react-hot-toast";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

interface JournalCardProps {
  journal: string;
  onClose?: () => void;
  theme?: "light" | "dark";
  trackUrl?: string;
  vibe: Vibe;
}

export default function JournalCard({
  journal,
  onClose,
  theme = "dark",
  trackUrl,
  vibe,
}: JournalCardProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(journal);
      toast.success("📋 Journal copied to clipboard!");
    } catch {
      toast.error("❌ Failed to copy");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([journal], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-entry-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      const auth = getAuth();
      let user = auth.currentUser;

      if (!user) {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        user = result.user;
      }

      const id = await saveVibe({ journal, trackUrl, vibe });
      const url = `${window.location.origin}/entry/${id}`;
      await navigator.clipboard.writeText(url);
      window.open(url, "_blank");
    } catch (err) {
      toast.error("❌ Failed to share or sign in");
      console.error(err);
    }
  };

  return (
    <div className="relative bg-white/10 text-white max-w-xl w-full mx-4 p-6 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-2xl">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white hover:opacity-70 cursor-pointer"
        >
          ✖
        </button>
      )}

      {/* Title + Metadata */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-wide mb-1">
          📝 Journal Entry
        </h2>
        <p className="text-sm opacity-60">{new Date().toLocaleString()}</p>
        <hr className="my-4 border-white/20" />
      </div>

      {/* Journal Body */}
      <div className="flex flex-col  gap-4">
        <div className="text-lg leading-relaxed  overflow-y-auto whitespace-break-spaces">
          {journal}
        </div>

        {/* Spotify Preview */}
        {trackUrl && (
          <iframe
            src={`https://open.spotify.com/embed/track/${
              trackUrl.split("/track/")[1]
            }`}
            width="100%"
            height="250"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="rounded-xl"
          ></iframe>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Button onClick={handleCopy} theme={theme}>
          📋 Copy
        </Button>
        <Button onClick={handleDownload} theme={theme}>
          📄 Download
        </Button>
        <Button onClick={handleShare} theme={theme}>
          ✨ Share / Save
        </Button>
      </div>
    </div>
  );
}
