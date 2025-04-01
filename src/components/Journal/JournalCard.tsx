"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Button from "@/components/UI/Button";
import { Vibe } from "@/types/VibeComponent";
import { saveVibe, isVibeSavedByUser } from "@/utils/saveVibe";
import toast from "react-hot-toast";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import html2canvas from "html2canvas-pro"; // Use html2canvas-pro instead
import { motion } from "framer-motion";
import { logEvent, AnalyticsEvents } from "@/utils/analytics";
import SocialShareButtons from "./SocialShareButtons";
import { fetchTrackMetadata, SpotifyTrackInfo } from "@/utils/fetchTrackMetadata";

interface JournalCardProps {
  journal: string;
  setJournal: (journal: string) => void;
  vibe: Vibe;
  trackUrl?: string;
  title?: string;
  setTitle?: (title: string) => void;
  onClose?: () => void;
  theme?: "light" | "dark";
  initialVibeId?: string; // Add prop for initial vibeId
  onVibeIdChange?: (vibeId: string) => void; // Add callback for vibeId changes
  skipAutoSave?: boolean; // Add prop to skip auto-save
}

export default function JournalCard({
  journal,
  setJournal,
  vibe,
  trackUrl,
  title,
  setTitle,
  onClose,
  theme = "dark",
  initialVibeId,
  onVibeIdChange,
  skipAutoSave = false,
}: JournalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAttemptedSaveRef = useRef(false); // Add ref to track save attempts
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setCopy] = useState(false);
  const [vibeId, setVibeId] = useState<string | null>(initialVibeId || null);
  const [isLinkedToUser, setIsLinkedToUser] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Check if the journal is already linked to the user when initialVibeId is provided
  useEffect(() => {
    const checkIfLinkedToUser = async () => {
      if (!vibeId) return;
      
      try {
        const auth = getAuth();
        if (auth.currentUser) {
          const isSaved = await isVibeSavedByUser(vibeId);
          setIsLinkedToUser(isSaved);
        }
      } catch (error) {
        console.error("Error checking if vibe is saved:", error);
      }
    };
    
    checkIfLinkedToUser();
  }, [vibeId]);

  // Auto-save the journal when it's created
  useEffect(() => {
    const autoSaveJournal = async () => {
      // Skip auto-save if we already have a vibeId, if journal is empty, or if we've already attempted to save
      // or if skipAutoSave is true
      if (vibeId || !journal.trim() || !vibe || hasAttemptedSaveRef.current || skipAutoSave) return;
      
      // Mark that we've attempted to save
      hasAttemptedSaveRef.current = true;

      try {
        // Auto-save without linking to user
        const savedVibeId = await saveVibe(
          {
            journal,
            vibe,
            trackUrl,
            title,
          },
          { linkToUser: false }
        );

        setVibeId(savedVibeId);

        // Notify parent component of vibeId change
        if (onVibeIdChange) {
          onVibeIdChange(savedVibeId);
        }

        // Check if it's already linked to the user
        const auth = getAuth();
        if (auth.currentUser) {
          const isSaved = await isVibeSavedByUser(savedVibeId);
          setIsLinkedToUser(isSaved);
        }
      } catch (error) {
        console.error("Error auto-saving journal:", error);
      }
    };

    autoSaveJournal();
  }, [trackUrl, vibeId, journal, vibe, title, onVibeIdChange, skipAutoSave]);

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
              ? `<img src="${trackInfo.albumArt}" alt="Album art" style="width: 100%; height: 100%; object-fit: cover;" />`
              : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.6C17.302 21.6 21.6 17.302 21.6 12C21.6 6.69807 17.302 2.4 12 2.4C6.69807 2.4 2.4 6.69807 2.4 12C2.4 17.302 6.69807 21.6 12 21.6Z" stroke="#1DB954" stroke-width="1.2"/>
                  <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#1DB954" stroke-width="1.2"/>
                  <path d="M12 13.6C12.8837 13.6 13.6 12.8837 13.6 12C13.6 11.1163 12.8837 10.4 12 10.4C11.1163 10.4 10.4 11.1163 10.4 12C10.4 12.8837 11.1163 13.6 12 13.6Z" fill="#1DB954" stroke="#1DB954" stroke-width="1.2"/>
                </svg>`
          }
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 14px; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${trackName}</div>
          <div style="font-size: 12px; color: #b3b3b3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${artistName}</div>
        </div>
        <div style="margin-left: 12px;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM11.7 11.5C11.6 11.7 11.4 11.8 11.2 11.8C11.1 11.8 11 11.8 10.9 11.7C9 10.5 6.5 10.3 4 10.9C3.7 11 3.4 10.8 3.3 10.5C3.2 10.2 3.4 9.9 3.7 9.8C6.5 9.2 9.3 9.4 11.5 10.7C11.8 10.9 11.9 11.2 11.7 11.5ZM12.7 9.3C12.5 9.5 12.3 9.6 12.1 9.6C12 9.6 11.9 9.6 11.8 9.5C9.5 8.1 6.3 7.8 4 8.5C3.6 8.6 3.2 8.4 3.1 8C3 7.6 3.2 7.2 3.6 7.1C6.3 6.3 10 6.7 12.6 8.3C12.9 8.5 13 8.9 12.7 9.3ZM12.8 7.1C10.1 5.5 6.3 5.4 4 6.1C3.6 6.2 3.1 6 3 5.5C2.9 5.1 3.1 4.6 3.6 4.5C6.3 3.7 10.6 3.8 13.8 5.7C14.2 5.9 14.3 6.4 14.1 6.8C13.9 7.1 13.5 7.2 13.1 7.1H12.8Z" fill="#1DB954"/>
          </svg>
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

  // Handle saving the journal entry
  const handleSave = async () => {
    if (!journal.trim()) {
      toast.error("Please write something in your journal");
      return;
    }

    if (!vibe) return;

    try {
      setIsSaving(true);
      
      // Check if user is logged in
      const auth = getAuth();
      if (!auth.currentUser) {
        // Show sign-in prompt
        toast.error("Please sign in to save your journal");
        
        // Track attempted save without login
        logEvent(AnalyticsEvents.JOURNAL_SAVED, { 
          status: 'failed', 
          reason: 'not_logged_in' 
        });
        
        setIsSaving(false);
        return;
      }

      // Check if the journal is already linked to the user
      if (vibeId) {
        const isSaved = await isVibeSavedByUser(vibeId);
        if (isSaved) {
          toast.success("Journal already saved to your account");
          setIsLinkedToUser(true);
          setIsSaving(false);
          return;
        }
      }

      // Show loading toast
      const loadingToast = toast.loading("Saving your journal...");

      // Save the journal with link to user
      const savedVibeId = await saveVibe(
        {
          journal,
          vibe,
          trackUrl,
          title,
          vibeId: vibeId || undefined,
        },
        { linkToUser: true }
      );

      // Update state
      setVibeId(savedVibeId);
      setIsLinkedToUser(true);

      // Notify parent component of vibeId change
      if (onVibeIdChange) {
        onVibeIdChange(savedVibeId);
      }

      // Show success or error toast
      toast.dismiss(loadingToast);
      toast.success("Journal saved to your account!");

      // Copy the URL to clipboard
      const url = `${window.location.origin}/entry/${savedVibeId}`;
      await navigator.clipboard.writeText(url);
      toast.success("🔗 Link copied to clipboard!");
      
      // Track successful save
      logEvent(AnalyticsEvents.JOURNAL_SAVED, { 
        status: 'success',
        has_track: !!trackUrl
      });
      
    } catch (error) {
      console.error("Error saving journal:", error);
      toast.error("An error occurred while saving");
      
      // Track failed save
      logEvent(AnalyticsEvents.JOURNAL_SAVED, { 
        status: 'failed',
        reason: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle copying the journal link
  const handleCopy = async () => {
    if (!vibeId) {
      toast.error("Journal hasn't been saved yet");
      
      // Track failed copy attempt
      logEvent(AnalyticsEvents.JOURNAL_SHARED, {
        status: 'failed',
        reason: 'not_saved'
      });
      
      return;
    }

    setCopy(true);

    try {
      const url = `${window.location.origin}/entry/${vibeId}`;
      await navigator.clipboard.writeText(url);
      toast.success("🔗 Link copied to clipboard!");
      
      // Track successful copy
      logEvent(AnalyticsEvents.JOURNAL_SHARED, {
        status: 'success'
      });
      
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link");
      
      // Track failed copy
      logEvent(AnalyticsEvents.JOURNAL_SHARED, {
        status: 'failed',
        reason: 'clipboard_error'
      });
      
    } finally {
      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setCopy(false);
      }, 3000);
    }
  };

  // Handle downloading the journal entry as an image
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
      
      // Hide social buttons if visible
      const socialButtons = cardRef.current.querySelector('.social-buttons');
      if (socialButtons) {
        socialButtons.classList.add('hidden');
      }

      if (trackUrl) {
        // Find the Spotify iframe
        spotifyIframe = cardRef.current.querySelector("iframe");

        if (spotifyIframe && spotifyIframe.parentElement) {
          // Get track metadata if needed
          const trackInfo = await fetchTrackMetadata(trackUrl);

          // Create visual representation for Spotify player
          spotifyContainer = createSpotifyVisual(
            spotifyIframe.parentElement,
            spotifyIframe,
            trackInfo
          ) as HTMLDivElement;
        }
      }

      // Use html2canvas to capture the card
      const canvas = await html2canvas(cardRef.current, {
        logging: false,
        backgroundColor: "transparent",
        scale: window.devicePixelRatio || 2,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 30000,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      // Restore the Spotify iframe if needed
      if (spotifyIframe && spotifyContainer) {
        spotifyIframe.style.display = "block";
        spotifyContainer.remove();
      }
      
      // Show the action buttons again
      if (actionButtons) {
        actionButtons.classList.remove('hidden');
      }
      
      // Show social buttons again
      if (socialButtons) {
        socialButtons.classList.remove('hidden');
      }

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create a download link
      const link = document.createElement("a");
      link.download = `${title || "journal"}-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();

      // Show success toast
      toast.dismiss(loadingToast);
      toast.success("Journal image saved!");
      
      // Track successful download
      logEvent(AnalyticsEvents.JOURNAL_DOWNLOADED, {
        has_track: !!trackUrl,
        has_title: !!title
      });
      
    } catch (error) {
      console.error("Error downloading journal:", error);
      toast.error("Failed to capture journal");
      
      // Track failed download
      logEvent(AnalyticsEvents.JOURNAL_DOWNLOADED, {
        status: 'failed',
        reason: 'capture_error'
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`p-6 relative bg-black/80 text-white max-w-xl w-full rounded-2xl shadow-2xl backdrop-blur-3xl ${vibe.font}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          ✖
        </button>
      )}

      {/* Title + Metadata */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-wide mb-1">
          {title || "📝 Journal Entry"}
        </h2>
        <p className="text-sm opacity-60">{new Date().toLocaleString()}</p>
        <hr className="my-4 border-white/20" />
      </div>

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
            allow="encrypted-media"
            className="rounded-lg"
          ></iframe>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 action-buttons">
        <Button onClick={handleCopy} theme={theme}>
          {isCopied ? "✅ Link Copied!" : "📋 Copy Link"}
        </Button>
        <Button onClick={handleDownload} theme={theme}>
          📸 Download
        </Button>
        <Button
          onClick={handleSave}
          theme={theme}
          disabled={isSaving || isLinkedToUser}
        >
          {isSaving ? "Saving..." : isLinkedToUser ? "✅ Saved" : "💾 Save"}
        </Button>
      </div>

      {/* Social share buttons */}
      {vibeId && (
        <div className="mt-4 social-buttons">
          <SocialShareButtons 
            url={`${window.location.origin}/entry/${vibeId}`}
            title={title || "Check out my journal entry on Aestheticify"}
            text={journal.substring(0, 100) + (journal.length > 100 ? "..." : "")}
            theme={theme}
            className="justify-center"
          />
        </div>
      )}
    </motion.div>
  );
}
