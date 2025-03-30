"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Vibe } from "@/types/VibeComponent";
import AuthButton from "@/components/AuthButton";

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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(user.uid);
      const userVibesRef = collection(db, "users", user.uid, "vibes");
      const q = query(userVibesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VibeEntry[];
      setVibes(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        <p className="text-lg animate-pulse">Loading your saved vibes...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white text-center px-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">🔐 Login Required</h2>
          <p className="mb-2">You need to be logged in to see your saved vibes.</p>
          <AuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🌟 My Saved Vibes</h1>

      {vibes.length === 0 ? (
        <p className="text-center opacity-60">
          No saved vibes yet. Go vibe and click save ✨
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vibes.map((v) => (
            <div
              key={v.id}
              className={`rounded-xl p-4 border border-white/20 bg-white/10 backdrop-blur ${v.vibe.bg} ${v.vibe.font}`}
            >
              <div className="text-2xl mb-2">{v.vibe.pet}</div>
              <p className="italic text-sm mb-2">"{v.vibe.quote}"</p>
              <p className="text-xs opacity-50 mb-3">
                {v.createdAt
                  ? new Date(v.createdAt.seconds * 1000).toLocaleString()
                  : "Unknown date"}
              </p>
              <button
                onClick={() => router.push(`/entry/${v.id}`)}
                className="text-sm underline hover:opacity-80 cursor-pointer"
              >
                🔗 View Vibe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
