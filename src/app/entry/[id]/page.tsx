"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ShareVibeModal from "@/components/Journal/ShareVibeModal";
import { Vibe } from "@/types/VibeComponent";

export default function SharedEntryPage() {
  const params = useParams();
  const router = useRouter();

  const [entry, setEntry] = useState<{
    id: string;
    title: string;
    journal: string;
    createdAt: string;
    vibe: Vibe;
    trackUrl?: string;
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
        });
      })
      .catch(() => setError(true));
  }, [params]);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white pt-16">
        <div className="text-center">
          <p className="text-lg">❌ This vibe link is invalid or expired.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 underline hover:opacity-80 cursor-pointer"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="pt-16">
      <ShareVibeModal
        id={entry.id}
        title={entry.title}
        journal={entry.journal}
        trackUrl={entry.trackUrl}
        vibe={entry.vibe}
        createdAt={entry.createdAt}
        onClose={() => router.push("/")}
      />
    </div>
  );
}
