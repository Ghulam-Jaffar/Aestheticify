"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Vibe } from "@/types/VibeComponent";
import AuthButton from "@/components/AuthButton";
import { motion } from "framer-motion";

interface VibeEntry {
  id: string;
  journal: string;
  createdAt?: { seconds: number; nanoseconds: number };
  vibe: Vibe;
  trackUrl?: string;
  title?: string;
}

export default function MyVibesPage() {
  const [vibes, setVibes] = useState<VibeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Separate authentication check from data fetching
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(user.uid);
      // Only set loading to false after we confirm user is logged in
      // Data fetching will happen in the next useEffect
    });

    return () => unsubscribe();
  }, []);

  // Separate data fetching effect that runs only after userId is set
  useEffect(() => {
    async function fetchVibes() {
      if (!userId) return;

      try {
        setLoading(true);
        const userVibesRef = collection(db, "users", userId, "vibes");
        const q = query(userVibesRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        // Fetch the actual vibe data from the main vibes collection
        const vibePromises = snapshot.docs.map(async (userVibeDoc) => {
          const vibeId = userVibeDoc.id;
          const vibeDocRef = doc(db, "vibes", vibeId);
          const vibeDoc = await getDoc(vibeDocRef);

          if (!vibeDoc.exists()) {
            console.warn(`Vibe with ID ${vibeId} not found in main collection`);
            return null;
          }

          return {
            id: vibeId,
            ...vibeDoc.data(),
          } as VibeEntry;
        });

        const fetchedVibes = await Promise.all(vibePromises);
        // Filter out any null values (vibes that weren't found)
        setVibes(fetchedVibes.filter((vibe) => vibe !== null) as VibeEntry[]);
      } catch (error) {
        console.error("Error fetching vibes:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchVibes();
    }
  }, [userId]);

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Item animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-lg animate-pulse mb-2">
            Loading your saved vibes...
          </p>
          <div className="flex justify-center space-x-2">
            <div
              className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/30 backdrop-blur-lg p-8 rounded-2xl border border-white/10 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-4">🔐 Login Required</h2>
          <p className="mb-6 text-gray-300">
            Sign in to view and manage your saved vibes collection.
          </p>
          <AuthButton />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/")}
          className="mt-4 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Return to Vibes
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-4 pt-24 pb-16 text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          My Saved Vibes
        </h1>
        <p className="text-gray-300 max-w-lg mx-auto">
          Your personal collection of saved aesthetic experiences
        </p>
      </motion.div>

      {vibes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center max-w-md mx-auto bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10"
        >
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-xl font-medium mb-2">No saved vibes yet</h3>
          <p className="text-gray-400 mb-6">
            Start creating and saving vibes to build your collection
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Create New Vibe
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {vibes &&
            vibes.map((v) => (
              <motion.div
                key={v.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`rounded-xl p-6 bg-white/10 backdrop-blur shadow-lg ${v.vibe.bg} ${v.vibe.font} cursor-pointer`}
                onClick={() => router.push(`/entry/${v.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">{v.vibe.pet}</div>
                  <div className="text-xs opacity-60 bg-black/20 px-2 py-1 rounded-full">
                    {v.createdAt
                      ? new Date(
                          v.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : "Unknown date"}
                  </div>
                </div>
                <p className="italic text-sm mb-4 line-clamp-2">
                  "{v.vibe.quote}"
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-xs opacity-70">
                    {v.journal
                      ? v.journal.substring(0, 30) + "..."
                      : "No journal entry"}
                  </p>
                  <span className="text-sm underline hover:opacity-80">
                    View →
                  </span>
                </div>
              </motion.div>
            ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors cursor-pointer"
        >
          ← Back to Vibes
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
