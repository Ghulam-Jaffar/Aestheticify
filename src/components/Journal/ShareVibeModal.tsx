"use client";

import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import Button from "@/components/UI/Button";
import { Vibe } from "@/types/VibeComponent";
import { Howl } from "howler";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

interface ShareCardProps {
  id?: string;
  title?: string;
  journal: string;
  createdAt?: string;
  trackUrl?: string;
  vibe: Vibe;
  onClose: () => void;
}

export default function ShareVibeModal({
  id,
  title,
  journal,
  createdAt,
  trackUrl,
  vibe,
  onClose,
}: ShareCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const audioRef = useRef<Howl | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!vibe.audio) return;

    const sound = new Howl({
      src: [vibe.audio],
      loop: true,
      volume: 0.5,
    });

    sound.play();
    audioRef.current = sound;

    return () => {
      audioRef.current?.unload();
    };
  }, [vibe.audio]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement("a");
    link.download = `my-vibe-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopyLink = async () => {
    if (!id) return;
    const url = `${window.location.origin}/entry/${id}`;
    await navigator.clipboard.writeText(url);
    toast.success("🔗 Shareable link copied to clipboard!");
  };

  const displayDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-auto">
      <div className="relative bg-white/10 border border-white/20 text-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full backdrop-blur-xl">
        <div
          ref={cardRef}
          className={`rounded-xl overflow-hidden p-6 text-white ${vibe.bg} ${vibe.font}`}
        >
          <h2 className="text-2xl font-bold mb-2">{title || "🌟 My Vibe"}</h2>
          <p className="text-sm opacity-50 mb-4">{displayDate}</p>
          <div className="text-3xl mb-2">{vibe.pet}</div>
          <p className="italic opacity-70 mb-4">"{vibe.quote}"</p>

          <div className="bg-white/10 p-4 rounded-xl max-h-[250px] overflow-y-auto">
            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {journal}
            </p>
          </div>

          {trackUrl && (
            <div className="mt-4">
              <iframe
                src={`https://open.spotify.com/embed/track/${
                  trackUrl.split("/track/")[1]
                }`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded"
              ></iframe>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <Button onClick={handleDownload}>📥 Save Image</Button>
          <Button onClick={handleCopyLink}>🔗 Copy Link</Button>
          <Button
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?text=Check out my vibe! ${window.location.origin}/entry/${id}`,
                "_blank"
              )
            }
          >
            🐦 Tweet
          </Button>
          <Button onClick={() => setShowQR(!showQR)}>📱 QR Code</Button>
        </div>
        {showQR && (
          <div className="flex flex-col gap-2 items-center justify-center mt-6 bg-white p-4 rounded-xl text-black shadow-xl border border-gray-200">
            <p className="font-semibold">Scan to view vibe</p>
            <QRCodeSVG
              value={`${window.location.origin}/entry/${id}`}
              size={160}
            />
          </div>
        )}
      </div>
    </div>
  );
}
