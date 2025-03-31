"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ShareVibeModal from "@/components/Journal/ShareVibeModal";
import { Vibe } from "@/types/VibeComponent";

export default function SharedEntryPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [entry, setEntry] = useState<{
    id: string;
    title: string;
    journal: string;
    createdAt: string;
    vibe: Vibe;
    trackUrl?: string;
    creator?: {
      displayName: string | null;
      photoURL: string | null;
    } | null;
  } | null>(null);

  const [error, setError] = useState(false);

  useEffect(() => {
    const id = (params as any)?.id;
    if (!id) return;

    fetch(`/api/entry/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.journal) {
          setError(true);
          return;
        }

        setEntry({
          id,
          title: data.title || "My Vibe",
          journal: data.journal,
          createdAt: data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : "",
          trackUrl: data.trackUrl,
          vibe: data.vibe,
          creator: data.creator || null,
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: { duration: 0.3 }
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="w-full h-screen flex items-center justify-center text-white"
        initial="hidden"
        animate="visible"
        variants={loadingVariants}
      >
        <div className="text-center">
          <p className="text-lg animate-pulse mb-4">Loading vibe...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="w-full h-screen flex items-center justify-center text-white pt-16"
        initial="hidden"
        animate="visible"
        variants={errorVariants}
      >
        <div className="text-center bg-black/30 backdrop-blur-lg p-8 rounded-2xl border border-white/10 max-w-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl mb-4"
          >
            ❌
          </motion.div>
          <p className="text-lg mb-6">This vibe link is invalid or expired.</p>
          <motion.button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to home
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!entry) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="w-full h-screen flex items-center justify-center pt-16"
        key="entry-container"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ShareVibeModal
            id={entry.id}
            title={entry.title}
            journal={entry.journal}
            trackUrl={entry.trackUrl}
            vibe={entry.vibe}
            createdAt={entry.createdAt}
            creator={entry.creator}
            onClose={() => router.push("/")}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
