"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/UI/Button";
import { Vibe } from "@/types/VibeComponent";
import { Howl } from "howler";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas-pro"; // Use html2canvas-pro instead
import { logEvent, AnalyticsEvents } from "@/utils/analytics";

interface SpotifyTrackInfo {
  name: string;
  artist: string;
  albumArt?: string;
}

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
  trackInfo?: SpotifyTrackInfo;
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
  trackInfo: initialTrackInfo,
}: ShareCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const audioRef = useRef<Howl | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [trackInfo, setTrackInfo] = useState<SpotifyTrackInfo | undefined>(
    initialTrackInfo
  );

  // Reusable function to fetch track metadata
  const fetchTrackMetadata = useCallback(
    async (trackUrl: string): Promise<SpotifyTrackInfo | undefined> => {
      try {
        // Extract track ID
        const trackId = trackUrl.split("/track/")[1]?.split("?")[0];
        if (!trackId) return undefined;

        // Fetch track details from our API
        const response = await fetch(`/api/spotify/track?id=${trackId}`);
        const data = await response.json();

        if (data.track) {
          return {
            name: data.track.name,
            artist: data.track.artists?.[0]?.name || "Unknown Artist",
            albumArt: data.track.album?.images?.[0]?.url,
          };
        }
      } catch (error) {
        console.error("Error fetching track info:", error);
      }
      return undefined;
    },
    []
  );

  // Reusable function to create a Spotify visual representation
  const createSpotifyVisual = useCallback(
    (
      parent: HTMLElement,
      spotifyIframe: HTMLIFrameElement,
      trackInfo?: SpotifyTrackInfo
    ) => {
      // Create a visual representation of the Spotify player
      const spotifyContainer = document.createElement("div");
      spotifyContainer.className = "spotify-visual-representation";
      spotifyContainer.style.width = "100%";
      spotifyContainer.style.height = "80px";
      spotifyContainer.style.backgroundColor = "#121212"; // Spotify dark background
      spotifyContainer.style.borderRadius = "8px";
      spotifyContainer.style.display = "flex";
      spotifyContainer.style.alignItems = "center";
      spotifyContainer.style.padding = "0 16px";

      // Use track info if available
      const trackName = trackInfo?.name || title || "Unknown Track";
      const artistName = trackInfo?.artist || "Spotify Track";

      // Create the content with track and artist info
      spotifyContainer.innerHTML = `
      <div style="display: flex; align-items: center; width: 100%;">
        <div style="width: 48px; height: 48px; background-color: #282828; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 12px; overflow: hidden;">
          ${
            trackInfo?.albumArt
              ? `<img src="${trackInfo.albumArt}" alt="Album Art" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />`
              : `<svg width="24" height="24" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>`
          }
        </div>
        <div style="flex-grow: 1; color: white;">
          <div style="font-weight: bold; font-size: 14px;">${trackName}</div>
          <div style="font-size: 12px; opacity: 0.8;">${artistName}</div>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="color: #1DB954; font-size: 12px; margin-right: 8px;">Spotify</div>
          <div style="width: 32px; height: 32px; background-color: #1DB954; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    `;

      // Hide the iframe and insert the visual representation
      spotifyIframe.style.display = "none";
      parent.appendChild(spotifyContainer);

      return spotifyContainer;
    },
    [title]
  );

  // Fetch track info if we have a trackUrl but no track info
  useEffect(() => {
    if (trackUrl && !trackInfo) {
      const loadTrackInfo = async () => {
        const metadata = await fetchTrackMetadata(trackUrl);
        if (metadata) {
          setTrackInfo(metadata);
        }
      };

      loadTrackInfo();
    }
  }, [trackUrl, trackInfo, fetchTrackMetadata]);

  // Setup audio playback
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

  // Handle copying the journal link
  const handleCopyLink = async () => {
    if (!id) return;

    try {
      const url = `${window.location.origin}/entry/${id}`;
      await navigator.clipboard.writeText(url);
      toast.success("🔗 Link copied to clipboard!");
      
      // Track successful copy
      logEvent(AnalyticsEvents.JOURNAL_SHARED, {
        status: 'success',
        source: 'modal'
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link");
      
      // Track failed copy
      logEvent(AnalyticsEvents.JOURNAL_SHARED, {
        status: 'failed',
        reason: 'clipboard_error',
        source: 'modal'
      });
    }
  };

  // Toggle QR code visibility
  const toggleQRCode = () => {
    const newState = !showQR;
    setShowQR(newState);
    
    // Track QR code viewed event
    if (newState) {
      logEvent(AnalyticsEvents.QR_CODE_VIEWED, {
        journal_id: id
      });
    }
  };

  // Capture and download the journal entry as an image
  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // Show loading toast
      const loadingToast = toast.loading("Capturing your journal...");

      // If there's a Spotify iframe, temporarily replace it with a visual representation
      let spotifyIframe: HTMLIFrameElement | null = null;
      let spotifyContainer: HTMLDivElement | null = null;

      // Find and hide the action buttons
      const actionButtons = cardRef.current.querySelector('.action-buttons');
      if (actionButtons) {
        actionButtons.classList.add('hidden');
      }

      // Hide QR code if visible
      const qrCode = cardRef.current.querySelector('.qr-code-container');
      if (qrCode) {
        qrCode.classList.add('hidden');
      }

      if (trackUrl) {
        // Find the Spotify iframe
        spotifyIframe = cardRef.current.querySelector("iframe");

        if (spotifyIframe && spotifyIframe.parentElement) {
          // Create visual representation for Spotify player
          spotifyContainer = createSpotifyVisual(
            spotifyIframe.parentElement,
            spotifyIframe,
            trackInfo
          ) as HTMLDivElement;
        }
      }

      // Capture the card with html2canvas-pro which supports modern CSS color functions
      const canvas = await html2canvas(cardRef.current, {
        logging: false,
        backgroundColor: "transparent",
        scale: window.devicePixelRatio || 2, // Use device pixel ratio for better quality
        useCORS: true, // Allow cross-origin images
        allowTaint: true, // Allow potentially tainted canvas
        imageTimeout: 30000, // Longer timeout for images
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      // Restore the Spotify iframe if we modified it
      if (spotifyIframe && spotifyContainer) {
        spotifyIframe.style.display = "";
        if (spotifyContainer.parentElement) {
          spotifyContainer.parentElement.removeChild(spotifyContainer);
        }
      }

      // Show the action buttons again
      if (actionButtons) {
        actionButtons.classList.remove('hidden');
      }

      // Show QR code again if it was visible
      if (qrCode) {
        qrCode.classList.remove('hidden');
      }

      // Create a filename with date for better organization
      const date = new Date().toISOString().split("T")[0];
      const filename = `journal-${date}-${Date.now()}.png`;

      // Convert to data URL and trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();

      // Dismiss loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success("Journal image saved!");
      
      // Track successful download
      logEvent(AnalyticsEvents.JOURNAL_DOWNLOADED, {
        source: 'modal',
        has_track: !!trackUrl,
        has_qr: showQR
      });
    } catch (error) {
      console.error("Error downloading journal:", error);
      toast.error("Failed to capture journal");
      
      // Track failed download
      logEvent(AnalyticsEvents.JOURNAL_DOWNLOADED, {
        status: 'failed',
        reason: 'capture_error',
        source: 'modal'
      });
    }
  };

  // Format date for display
  const displayDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : new Date().toLocaleString();

  // Animation variants for modal
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
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  // Use track name as title if available and no title is provided
  const displayTitle =
    title ||
    vibe.quote ||
    (trackInfo ? `${trackInfo.name} - ${trackInfo.artist}` : "Journal Entry");

  return (
    <motion.div
      ref={cardRef}
      className={`p-6 relative bg-black/80 text-white max-w-xl w-full rounded-2xl shadow-2xl backdrop-blur-3xl ${vibe.font} ${vibe.bg}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <>
        {/* Title + Metadata */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-wide mb-1">
            {displayTitle}
          </h2>
          <p className="text-sm opacity-60">{displayDate}</p>
          {creator && creator.displayName && (
            <div className="flex items-center mt-2">
              {creator.photoURL && !imageError ? (
                <img
                  src={creator.photoURL}
                  alt={creator.displayName}
                  className="w-5 h-5 rounded-full mr-2"
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              ) : imageError ? (
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mr-2 grid place-items-center text-xs">
                  {creator.displayName?.charAt(0).toUpperCase() || "U"}
                </span>
              ) : null}
              <span className="text-sm opacity-60 truncate max-w-[150px]">
                {creator.displayName}
              </span>
            </div>
          )}
          <hr className="my-4 border-white/20" />
        </div>

        {/* Journal content */}
        <>
          {/* Pet emoji */}
          <div className="text-3xl mb-4">{vibe.pet}</div>

          {/* Journal text */}
          <div className="text-lg leading-relaxed mb-4 whitespace-pre-wrap">
            {journal}
          </div>

          {/* Spotify embed */}
          {trackUrl && (
            <div className="mt-4">
              <iframe
                src={`https://open.spotify.com/embed/track/${
                  trackUrl.split("/track/")[1]
                }`}
                width="100%"
                height="250"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-xl"
              ></iframe>
            </div>
          )}
        </>
      </>

      {/* Actions */}
      <motion.div
        className="mt-6 flex flex-wrap justify-center gap-4 action-buttons"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button onClick={handleCopyLink}>🔗 Copy Link</Button>
        <Button onClick={handleDownload}>📸 Download</Button>
        <Button onClick={toggleQRCode}>
          {showQR ? "↩️ Hide QR" : "📱 Show QR"}
        </Button>
      </motion.div>

      {/* QR Code */}
      <AnimatePresence>
        {showQR && id && (
          <motion.div
            className="mt-6 flex justify-center qr-code-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white p-2 rounded-xl">
              <QRCodeSVG
                value={`${window.location.origin}/entry/${id}`}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
