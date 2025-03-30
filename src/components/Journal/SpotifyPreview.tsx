"use client";

import React, { useEffect, useState } from "react";

interface SpotifyPreviewProps {
  url: string;
}

interface SpotifyMeta {
  thumbnail_url: string;
  title: string;
}

export default function SpotifyPreview({ url }: SpotifyPreviewProps) {
  const [meta, setMeta] = useState<SpotifyMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;

    const fetchMetadata = async () => {
      try {
        const res = await fetch(
          `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        setMeta(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (loading)
    return <p className="text-sm text-white/60">Loading Spotify preview...</p>;
  if (error || !meta) return null;

  return (
    <div className="mt-6 bg-white/10 p-4 rounded-xl shadow-lg flex gap-4 items-center hover:scale-[1.01] transition cursor-pointer">
      <img
        src={meta.thumbnail_url}
        alt={meta.title}
        className="w-16 h-16 rounded shadow-md"
      />
      <div className="flex-1 text-left">
        <h4 className="text-sm font-semibold line-clamp-1">{meta.title}</h4>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-300 hover:underline"
        >
          Open in Spotify
        </a>
      </div>
    </div>
  );
}
