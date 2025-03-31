"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/UI/Button";
import { Vibe } from "@/types/VibeComponent";
import { Howl } from "howler";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

interface ShareCardProps {
  id?: string;
  title?: string;
  journal: string;
  createdAt?: string;
  trackUrl?: string;
  vibe: Vibe;
  onClose: () => void;
  creator?: {
    displayName: string | null;
    photoURL: string | null;
  } | null;
}

export default function ShareVibeModal({
  id,
  title,
  journal,
  createdAt,
  trackUrl,
  vibe,
  onClose,
  creator,
}: ShareCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const audioRef = useRef<Howl | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + custom * 0.1,
        duration: 0.4,
      },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const qrVariants = {
    hidden: { opacity: 0, height: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      height: "auto",
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="relative bg-white/10 border border-white/20 text-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full backdrop-blur-xl"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <motion.div
        ref={cardRef}
        className={`rounded-xl overflow-hidden p-6 text-white ${vibe.bg} ${vibe.font}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">{title || "🌟 My Vibe"}</h2>
        <div className="flex items-center justify-between mb-4 flex-wrap">
          <p className="text-sm opacity-70">{displayDate}</p>
          {creator && creator.displayName && (
            <div className="flex items-center text-sm opacity-70">
              <span className="truncate max-w-[150px]">{creator.displayName}</span>
              {creator.photoURL && !imageError ? (
                <img
                  src={creator.photoURL}
                  alt={creator.displayName}
                  className="w-5 h-5 rounded-full ml-2 inline-block flex-shrink-0"
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              ) : imageError ? (
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ml-2 grid place-items-center text-xs flex-shrink-0">
                  {creator.displayName?.charAt(0).toUpperCase() || "U"}
                </span>
              ) : null}
            </div>
          )}
        </div>
        <motion.div
          className="text-3xl mb-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {vibe.pet}
        </motion.div>
        <motion.p
          className="italic opacity-70 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          "{vibe.quote}"
        </motion.p>

        <motion.div
          className="bg-white/10 p-4 rounded-xl max-h-[250px] overflow-y-auto border border-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="whitespace-pre-wrap leading-relaxed text-sm">
            {journal}
          </p>
        </motion.div>

        {trackUrl && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
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
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="mt-6 flex gap-4 justify-center flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <motion.div
          custom={0}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button onClick={handleDownload}>📥 Save Image</Button>
        </motion.div>

        <motion.div
          custom={1}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button onClick={handleCopyLink}>🔗 Copy Link</Button>
        </motion.div>

        <motion.div
          custom={2}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
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
        </motion.div>

        <motion.div
          custom={3}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button onClick={() => setShowQR(!showQR)}>
            📱 {showQR ? "Hide QR" : "QR Code"}
          </Button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showQR && (
          <motion.div
            className="flex flex-col gap-2 items-center justify-center mt-6 bg-white p-4 rounded-xl text-black shadow-xl border border-gray-200"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={qrVariants}
          >
            <p className="font-semibold">Scan to view vibe</p>
            <QRCodeSVG
              value={`${window.location.origin}/entry/${id}`}
              size={160}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
