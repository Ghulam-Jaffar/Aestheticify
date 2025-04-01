'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/UI/Button';
import { logEvent, AnalyticsEvents } from '@/utils/analytics';

interface SocialShareProps {
  url: string;
  title: string;
  text?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export default function SocialShareButtons({ 
  url, 
  title, 
  text = '', 
  theme = 'dark',
  className = '' 
}: SocialShareProps) {
  // Track sharing events
  const trackShare = (platform: string, status: 'success' | 'failed', reason?: string) => {
    logEvent('social_share', {
      platform,
      status,
      url: url.includes('/entry/') ? 'journal' : 'other',
      ...(reason && { reason })
    });
  };

  // Share to Twitter/X
  const shareToTwitter = () => {
    try {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      trackShare('twitter', 'success');
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      trackShare('twitter', 'failed', 'window_open_error');
    }
  };

  // Share to Facebook
  const shareToFacebook = () => {
    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
      trackShare('facebook', 'success');
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      trackShare('facebook', 'failed', 'window_open_error');
    }
  };

  // Share to LinkedIn
  const shareToLinkedIn = () => {
    try {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
      trackShare('linkedin', 'success');
    } catch (error) {
      console.error('Error sharing to LinkedIn:', error);
      trackShare('linkedin', 'failed', 'window_open_error');
    }
  };

  // Share using Web Share API if available
  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        trackShare('native', 'success');
      } catch (error) {
        console.error('Error with native share:', error);
        // User may have cancelled, which is not a true error
        if (error instanceof Error && error.name !== 'AbortError') {
          trackShare('native', 'failed', error.name);
        }
      }
    } else {
      // Fallback to copy link if Web Share API is not available
      try {
        if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
          // Add type assertion to help TypeScript understand the clipboard API
          await (navigator as Navigator & { clipboard: { writeText(text: string): Promise<void> } }).clipboard.writeText(url);
          trackShare('clipboard', 'success');
        } else {
          // If clipboard API is not available, show a message to manually copy
          trackShare('clipboard', 'failed', 'clipboard_not_supported');
          alert(`Please copy this URL manually: ${url}`);
        }
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        trackShare('clipboard', 'failed', 'clipboard_error');
      }
    }
  };

  return (
    <motion.div 
      className={`flex flex-wrap gap-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* <Button 
        onClick={shareToTwitter} 
        theme={theme}
        className="!px-3"
      >
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share
        </span>
      </Button>
      <Button 
        onClick={shareToFacebook} 
        theme={theme}
        className="!px-3"
      >
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Share
        </span>
      </Button>
      <Button 
        onClick={shareToLinkedIn} 
        theme={theme}
        className="!px-3"
      >
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share
        </span>
      </Button> */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button 
          onClick={shareNative} 
          theme={theme}
          className="!px-3"
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </span>
        </Button>
      )}
    </motion.div>
  );
}
